import { Plus, Settings, Eye, Code, Image, Video, DollarSign, Target, Calendar, BarChart3 } from 'lucide-react';
import { React, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface AdCampaign {
  id: string;
  name: string;
  type: 'banner' | 'native' | 'video' | 'popup' | 'slide-in' | 'exit-intent' | 'sticky' | 'in-article';
  status: 'active' | 'paused' | 'draft' | 'completed';
  content: {
    title?: string;
    description?: string;
    image?: string;
    video?: string;
    cta?: string;
    url?: string;
  };
  targeting: {
    countries: string[];
    categories: string[];
    tags: string[];
    devices: ('desktop' | 'mobile' | 'tablet')[];
    userTypes: ('new' | 'returning' | 'premium')[];
    minPoints?: number;
    maxPoints?: number;
  };
  placement: {
    position: 'header' | 'sidebar' | 'in-article' | 'between-articles' | 'footer' | 'popup' | 'slide-bottom' | 'slide-right';
    priority: number;
    frequency: 'every-time' | 'once-per-session' | 'once-per-day' | 'once-per-week';
    delay?: number;
    scrollPercentage?: number;
    exitIntent?: boolean;
  };
  schedule: {
    startDate: Date;
    endDate?: Date;
    daysOfWeek: number[];
    hours: { start: number; end: number }[];
  };
  budget: {
    type: 'cpm' | 'cpc' | 'cpa' | 'flat';
    amount: number;
    currency: string;
    dailyLimit?: number;
    totalLimit?: number;
  };
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    ctr: number;
    cpc: number;
    cpm: number;
    roi: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface AdTemplate {
  id: string;
  name: string;
  type: AdCampaign['type'];
  category: 'ecommerce' | 'saaS' | 'services' | 'education' | 'entertainment' | 'news' | 'other';
  preview: string;
  content: AdCampaign['content'];
  responsive: boolean;
  customizable: boolean;
}

const AdsManager: React.FC = () => {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<AdCampaign | null>(null);
  const [showNewCampaignDialog, setShowNewCampaignDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'campaigns' | 'templates' | 'analytics' | 'settings'>('campaigns');

  const adTemplates: AdTemplate[] = [
    {
      id: 'ecommerce-banner-1',
      name: 'Bannière E-commerce Classique',
      type: 'banner',
      category: 'ecommerce',
      preview: '🛍️',
      content: {
        title: 'Soldes d\'été - Jusqu\'à 70% de réduction',
        description: 'Ne manquez pas nos offres exclusives',
        cta: 'Acheter maintenant',
        url: 'https://example.com'
      },
      responsive: true,
      customizable: true
    },
    {
      id: 'saas-native-1',
      name: 'Publicité Native SaaS',
      type: 'native',
      category: 'saas',
      preview: '💼',
      content: {
        title: 'Boostez votre productivité avec notre outil',
        description: 'Découvrez comment nos clients augmentent leur efficacité de 40%',
        cta: 'Essai gratuit',
        url: 'https://example.com'
      },
      responsive: true,
      customizable: true
    },
    {
      id: 'video-entertainment-1',
      name: 'Vidéo Promotionnelle',
      type: 'video',
      category: 'entertainment',
      preview: '🎬',
      content: {
        title: 'Nouveau film à ne pas manquer',
        description: 'Regardez la bande-annonce exclusive',
        video: 'https://example.com/video.mp4',
        url: 'https://example.com'
      },
      responsive: true,
      customizable: true
    },
    {
      id: 'exit-intent-newsletter',
      name: 'Popup Newsletter Exit-Intent',
      type: 'exit-intent',
      category: 'news',
      preview: '📧',
      content: {
        title: 'Ne partez pas vite!',
        description: 'Inscrivez-vous à notre newsletter et recevez nos meilleurs articles',
        cta: 'S\'inscrire',
        url: 'https://example.com/newsletter'
      },
      responsive: true,
      customizable: true
    },
    {
      id: 'slide-in-bottom',
      name: 'Slide-in Bas',
      type: 'slide-in',
      category: 'services',
      preview: '💬',
      content: {
        title: 'Besoin d\'aide?',
        description: 'Chattez avec nos experts',
        cta: 'Commencer',
        url: 'https://example.com/chat'
      },
      responsive: true,
      customizable: true
    }
  ];

  const createCampaign = (template?: AdTemplate) => {
    const newCampaign: AdCampaign = {
      id: Date.now().toString(),
      name: `Campagne ${campaigns.length + 1}`,
      type: template?.type ?? 'banner',
      status: 'draft',
      content: template?.content ?? {
        title: 'Votre titre ici',
        description: 'Votre description ici',
        cta: 'En savoir plus',
        url: 'https://example.com'
      },
      targeting: {
        countries: ['FR', 'BE', 'CH'],
        categories: ['technology', 'news'],
        tags: [],
        devices: ['desktop', 'mobile', 'tablet'],
        userTypes: ['new', 'returning']
      },
      placement: {
        position: 'sidebar',
        priority: 1,
        frequency: 'once-per-session'
      },
      schedule: {
        startDate: new Date(),
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        hours: [{ start: 0, end: 23 }]
      },
      budget: {
        type: 'cpm',
        amount: 5,
        currency: 'EUR',
        dailyLimit: 50,
        totalLimit: 500
      },
      metrics: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0,
        ctr: 0,
        cpc: 0,
        cpm: 0,
        roi: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setCampaigns([...campaigns, newCampaign]);
    setSelectedCampaign(newCampaign);
    setShowNewCampaignDialog(true);
  };

  const updateCampaign = (campaignId: string, updates: Partial<AdCampaign>) => {
    setCampaigns(campaigns.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, ...updates, updatedAt: new Date() }
        : campaign
    ));
  };

  const deleteCampaign = (campaignId: string) => {
    setCampaigns(campaigns.filter(campaign => campaign.id !== campaignId));
  };

  const duplicateCampaign = (campaign: AdCampaign) => {
    const duplicated: AdCampaign = {
      ...campaign,
      id: Date.now().toString(),
      name: `${campaign.name} (Copie)`,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      metrics: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0,
        ctr: 0,
        cpc: 0,
        cpm: 0,
        roi: 0
      }
    };
    setCampaigns([...campaigns, duplicated]);
  };

  const getStatusColor = (status: AdCampaign['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: AdCampaign['type']) => {
    switch (type) {
      case 'banner': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'popup': return <Target className="w-4 h-4" />;
      case 'slide-in': return <Code className="w-4 h-4" />;
      case 'exit-intent': return <Calendar className="w-4 h-4" />;
      default: return <Image className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Publicités</h1>
          <p className="text-gray-600">Créez et gérez vos campagnes publicitaires</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus ce mois</p>
                <p className="text-2xl font-bold text-gray-900">€2,450</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Impressions</p>
                <p className="text-2xl font-bold text-gray-900">145K</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CTR Moyen</p>
                <p className="text-2xl font-bold text-gray-900">2.4%</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Campagnes Actives</p>
                <p className="text-2xl font-bold text-gray-900">{campaigns.filter(c => c.status === 'active').length}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}>
          <TabsList className="mb-6">
            <TabsTrigger value="campaigns">Campagnes</TabsTrigger>
            <TabsTrigger value="templates">Modèles</TabsTrigger>
            <TabsTrigger value="analytics">Analytiques</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Mes Campagnes</h2>
                <Button onClick={() => createCampaign()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle Campagne
                </Button>
              </div>

              {campaigns.length === 0 ? (
                <Card className="p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <Target className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune campagne</h3>
                  <p className="text-gray-500 mb-4">Créez votre première campagne publicitaire</p>
                  <Button onClick={() => createCampaign()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Créer une campagne
                  </Button>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {campaigns.map((campaign) => (
                    <Card key={campaign.id} className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(campaign.type)}
                          <div>
                            <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                            <p className="text-sm text-gray-500 capitalize">{campaign.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                            {campaign.status}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCampaign(campaign)}
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{campaign.metrics.impressions.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">Impressions</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{campaign.metrics.clicks.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">Clics</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{campaign.metrics.ctr.toFixed(2)}%</p>
                          <p className="text-sm text-gray-500">CTR</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">€{campaign.metrics.revenue.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">Revenu</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => duplicateCampaign(campaign)}
                        >
                          Dupliquer
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteCampaign(campaign.id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adTemplates.map((template) => (
                <Card key={template.id} className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{template.preview}</div>
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{template.category}</p>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Type:</span>
                      <span className="font-medium capitalize">{template.type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Responsive:</span>
                      <span className="font-medium">{template.responsive ? 'Oui' : 'Non'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Personnalisable:</span>
                      <span className="font-medium">{template.customizable ? 'Oui' : 'Non'}</span>
                    </div>
                  </div>
                  
                  <Button
                    className="w-full"
                    onClick={() => {
                      createCampaign(template);
                      setShowNewCampaignDialog(true);
                    }}
                  >
                    Utiliser ce modèle
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Aperçu des performances</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Graphiques de performance - À implémenter</p>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Meilleures campagnes</h3>
                <div className="space-y-3">
                  {campaigns.slice(0, 5).map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-sm text-gray-500">{campaign.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">€{campaign.metrics.revenue.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">{campaign.metrics.ctr.toFixed(2)}% CTR</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Paramètres généraux</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="adblock-detection">Détection AdBlock</Label>
                    <Switch id="adblock-detection" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="exit-intent">Popup Exit-Intent</Label>
                    <Switch id="exit-intent" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="slide-in-ads">Publicités coulissantes</Label>
                    <Switch id="slide-in-ads" />
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Formats publicitaires</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Bannières</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Publicités natives</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Vidéos</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Popups</span>
                    <Switch />
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* New/Edit Campaign Dialog */}
      <Dialog open={showNewCampaignDialog} onOpenChange={setShowNewCampaignDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedCampaign?.id ? 'Modifier la campagne' : 'Nouvelle campagne'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nom de la campagne</Label>
                <Input
                  value={selectedCampaign?.name ?? ''}
                  onChange={(e) => setSelectedCampaign(prev => prev ? { ...prev, name: e.target.value } : null)}
                  placeholder="Ma super campagne"
                />
              </div>
              <div>
                <Label>Type de publicité</Label>
                <Select value={selectedCampaign?.type ?? 'banner'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="banner">Bannière</SelectItem>
                    <SelectItem value="native">Native</SelectItem>
                    <SelectItem value="video">Vidéo</SelectItem>
                    <SelectItem value="popup">Popup</SelectItem>
                    <SelectItem value="slide-in">Slide-in</SelectItem>
                    <SelectItem value="exit-intent">Exit-Intent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label>Contenu de la publicité</Label>
              <div className="space-y-3">
                <Input
                  value={selectedCampaign?.content.title ?? ''}
                  onChange={(e) => setSelectedCampaign(prev => prev ? { 
                    ...prev, 
                    content: { ...prev.content, title: e.target.value }
                  } : null)}
                  placeholder="Titre"
                />
                <Textarea
                  value={selectedCampaign?.content.description ?? ''}
                  onChange={(e) => setSelectedCampaign(prev => prev ? { 
                    ...prev, 
                    content: { ...prev.content, description: e.target.value }
                  } : null)}
                  placeholder="Description"
                  rows={3}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    value={selectedCampaign?.content.cta ?? ''}
                    onChange={(e) => setSelectedCampaign(prev => prev ? { 
                      ...prev, 
                      content: { ...prev.content, cta: e.target.value }
                    } : null)}
                    placeholder="Texte du bouton"
                  />
                  <Input
                    value={selectedCampaign?.content.url ?? ''}
                    onChange={(e) => setSelectedCampaign(prev => prev ? { 
                      ...prev, 
                      content: { ...prev.content, url: e.target.value }
                    } : null)}
                    placeholder="URL de destination"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowNewCampaignDialog(false)}>
                Annuler
              </Button>
              <Button onClick={() => {
                if (selectedCampaign) {
                  if (selectedCampaign.id) {
                    updateCampaign(selectedCampaign.id, selectedCampaign);
                  } else {
                    setCampaigns(prev => [...prev, selectedCampaign]);
                  }
                  setShowNewCampaignDialog(false);
                }
              }}>
                Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdsManager;