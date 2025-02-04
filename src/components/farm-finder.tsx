'use client'

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Filter } from 'lucide-react';

export interface Farm {
  id: number;
  name: string;
  description: string;
  badges: string[];
  distance: string;
}

export function RegenerativeFarmFinder() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const farms: Farm[] = [
    {
      id: 1,
      name: "Force of Nature",
      description: "100% Grass-fed Regenerative Beef",
      badges: ["Verified Regenerative", "Ships Nationwide"],
      distance: "12 miles"
    },
    {
      id: 2,
      name: "Green Pastures Farm",
      description: "Regenerative Dairy and Vegetables",
      badges: ["Organic Certified", "Local Pickup"],
      distance: "5 miles"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Regenerative Farm Finder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search farms by name or products..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
          
          <div className="w-full h-64 bg-gray-100 rounded-lg mb-6 flex items-center justify-center">
            <p className="text-gray-500">Map Component Would Go Here</p>
          </div>

          <div className="space-y-4">
            {farms.map(farm => (
              <Card key={farm.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{farm.name}</h3>
                      <p className="text-gray-600 mb-3">{farm.description}</p>
                      <div className="flex gap-2 flex-wrap">
                        {farm.badges.map((badge, index) => (
                          <Badge key={index} variant="secondary">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {farm.distance}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}