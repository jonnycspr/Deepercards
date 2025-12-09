import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Save, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import DeeperLogo from '@/components/DeeperLogo';
import { useLocalStorage, defaultSettings, AppSettings } from '@/lib/useLocalStorage';

export default function AdminSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useLocalStorage<AppSettings>('deeper-settings', defaultSettings);
  const [logoColor, setLogoColor] = useState(settings.logoColor);
  const [backgroundColor, setBackgroundColor] = useState(settings.backgroundColor);

  useEffect(() => {
    setLogoColor(settings.logoColor);
    setBackgroundColor(settings.backgroundColor);
  }, [settings]);

  const handleSave = () => {
    setSettings({
      logoColor,
      backgroundColor,
    });
    toast({
      title: 'Settings saved',
      description: 'Your theme settings have been updated.',
    });
  };

  const presetColors = [
    { name: 'Light Blue', value: '#A8D4F5' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Navy', value: '#004A7E' },
    { name: 'Purple', value: '#8253EE' },
    { name: 'Teal', value: '#008475' },
    { name: 'Black', value: '#000000' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon" data-testid="button-back-admin">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">Theme Settings</h1>
            <p className="text-sm text-muted-foreground">Customize the app appearance</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Logo Color
            </CardTitle>
            <CardDescription>
              Choose a color for the Deeper logo displayed throughout the app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-8 rounded-lg flex justify-center" style={{ backgroundColor }}>
              <DeeperLogo color={logoColor} className="h-20" />
            </div>

            <div className="space-y-3">
              <Label>Preset Colors</Label>
              <div className="flex flex-wrap gap-2">
                {presetColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setLogoColor(color.value)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      logoColor === color.value ? 'ring-2 ring-primary ring-offset-2' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                    data-testid={`button-preset-${color.name.toLowerCase().replace(' ', '-')}`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logoColor">Custom Color (Hex)</Label>
              <div className="flex gap-2">
                <Input
                  id="logoColor"
                  type="color"
                  value={logoColor}
                  onChange={(e) => setLogoColor(e.target.value)}
                  className="w-16 h-10 p-1 cursor-pointer"
                  data-testid="input-logo-color-picker"
                />
                <Input
                  type="text"
                  value={logoColor}
                  onChange={(e) => setLogoColor(e.target.value)}
                  placeholder="#A8D4F5"
                  className="flex-1"
                  data-testid="input-logo-color-hex"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-16 h-10 p-1 cursor-pointer"
                  data-testid="input-bg-color-picker"
                />
                <Input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  placeholder="#BDE1FF"
                  className="flex-1"
                  data-testid="input-bg-color-hex"
                />
              </div>
            </div>

            <Button onClick={handleSave} className="w-full" data-testid="button-save-settings">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
