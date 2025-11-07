import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const GUEST_SESSION_KEY = "guest_session_id";
const GUEST_TIME_LIMIT = 40; // 40 secondes
const BLOCK_DURATION = 24 * 60 * 60 * 1000; // 24 heures en millisecondes

export const useGuestMode = () => {
  const [timeRemaining, setTimeRemaining] = useState<number>(GUEST_TIME_LIMIT);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const getOrCreateSessionId = useCallback(() => {
    let sessionId = localStorage.getItem(GUEST_SESSION_KEY);
    if (!sessionId) {
      sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(GUEST_SESSION_KEY, sessionId);
    }
    return sessionId;
  }, []);

  const checkGuestSession = useCallback(async () => {
    const sessionId = getOrCreateSessionId();

    try {
      const { data: existingSession, error: fetchError } = await supabase
        .from("guest_sessions")
        .select("*")
        .eq("session_id", sessionId)
        .maybeSingle();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error fetching guest session:", fetchError);
        return;
      }

      const now = new Date();

      if (existingSession) {
        // Vérifier si le compte est bloqué
        if (existingSession.blocked_until) {
          const blockedUntil = new Date(existingSession.blocked_until);
          if (now < blockedUntil) {
            setIsBlocked(true);
            setTimeRemaining(0);
            setShowAuthPrompt(true);
            return;
          } else {
            // Débloquer et réinitialiser le timer
            await supabase
              .from("guest_sessions")
              .update({
                time_remaining_seconds: GUEST_TIME_LIMIT,
                blocked_until: null,
                last_visit: now.toISOString(),
              })
              .eq("session_id", sessionId);
            
            setIsBlocked(false);
            setTimeRemaining(GUEST_TIME_LIMIT);
          }
        } else {
          setTimeRemaining(existingSession.time_remaining_seconds);
        }
      } else {
        // Créer une nouvelle session invité
        await supabase.from("guest_sessions").insert({
          session_id: sessionId,
          time_remaining_seconds: GUEST_TIME_LIMIT,
          first_visit: now.toISOString(),
          last_visit: now.toISOString(),
        });
        setTimeRemaining(GUEST_TIME_LIMIT);
      }
    } catch (error) {
      console.error("Error managing guest session:", error);
    }
  }, [getOrCreateSessionId]);

  const updateTimeRemaining = useCallback(async (newTime: number) => {
    const sessionId = getOrCreateSessionId();
    
    if (newTime <= 0) {
      // Bloquer pendant 24h
      const blockedUntil = new Date(Date.now() + BLOCK_DURATION);
      await supabase
        .from("guest_sessions")
        .update({
          time_remaining_seconds: 0,
          blocked_until: blockedUntil.toISOString(),
          last_visit: new Date().toISOString(),
        })
        .eq("session_id", sessionId);
      
      setIsBlocked(true);
      setShowAuthPrompt(true);
    } else {
      await supabase
        .from("guest_sessions")
        .update({
          time_remaining_seconds: newTime,
          last_visit: new Date().toISOString(),
        })
        .eq("session_id", sessionId);
    }
  }, [getOrCreateSessionId]);

  useEffect(() => {
    checkGuestSession();
  }, [checkGuestSession]);

  useEffect(() => {
    if (timeRemaining <= 0 || isBlocked) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          updateTimeRemaining(0);
          return 0;
        }
        // Mettre à jour toutes les 10 secondes
        if (newTime % 10 === 0) {
          updateTimeRemaining(newTime);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, isBlocked, updateTimeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return {
    timeRemaining,
    isBlocked,
    showAuthPrompt,
    formatTime,
    setShowAuthPrompt,
  };
};
