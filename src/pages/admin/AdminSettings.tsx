                <div>
                  <Label>Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des résumés hebdomadaires
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Sauvegarde & Export</h2>
            <div className="space-y-4">
              <Button variant="outline" className="w-full">
                Exporter tous les articles (JSON)
              </Button>
              <Button variant="outline" className="w-full">
                Restaurer depuis une sauvegarde
              </Button>
            </div>
          </Card>

          <Card className="p-6 border-destructive">
            <h2 className="text-2xl font-bold mb-4 text-destructive">Zone de Danger</h2>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
