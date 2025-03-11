
import React, { useState } from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import ProformaGrid from "@/components/proforma/ProformaGrid";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TimeView = 'monthly' | 'quarterly' | 'yearly';

const ProformaView = () => {
  const [timeView, setTimeView] = useState<TimeView>('yearly');

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Project Finance Proforma</h1>
          <div className="flex items-center gap-4">
            <Tabs value={timeView} onValueChange={(value) => setTimeView(value as TimeView)}>
              <TabsList>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        <ProformaGrid timeView={timeView} />
      </div>
    </AppLayout>
  );
};

export default ProformaView;
