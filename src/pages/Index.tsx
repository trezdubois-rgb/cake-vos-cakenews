import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/accueil");
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="space-y-4 text-center">
        <div className="skeleton w-16 h-16 rounded-full mx-auto"></div>
        <div className="skeleton h-6 w-48 rounded mx-auto"></div>
      </div>
    </div>
  );
};

export default Index;
