"use client";

import { AdminHeader } from "@/components/admin/AdminShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  return (
    <div>
      <AdminHeader
        title="Settings"
        eyebrow="Workspace"
        description="Manage agency-wide preferences."
      />
      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-burgundy">Agency profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agency-name">Agency name</Label>
              <Input id="agency-name" defaultValue="Lena Real Estate" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agency-email">Contact email</Label>
              <Input id="agency-email" type="email" defaultValue="hello@lenaestate.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agency-phone">Phone</Label>
              <Input id="agency-phone" defaultValue="+234 1 234 5678" />
            </div>
            <Button>Save changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-burgundy">Currency &amp; locale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="default-currency">Default currency</Label>
              <Input id="default-currency" defaultValue="NGN" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" defaultValue="Africa/Lagos" />
            </div>
            <Button variant="outline">Update preferences</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
