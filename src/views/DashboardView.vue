<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Dashboard</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Chart Card 1 -->
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="h-32 bg-muted rounded flex items-center justify-center">
            <p class="text-muted-foreground">Chart Placeholder</p>
          </div>
        </CardContent>
      </Card>

      <!-- Chart Card 2 -->
      <Card>
        <CardHeader>
          <CardTitle>User Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="h-32 bg-muted rounded flex items-center justify-center">
            <p class="text-muted-foreground">Chart Placeholder</p>
          </div>
        </CardContent>
      </Card>

      <!-- Chart Card 3 -->
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="h-32 bg-muted rounded flex items-center justify-center">
            <p class="text-muted-foreground">Chart Placeholder</p>
          </div>
        </CardContent>
      </Card>

      <!-- Chart Card 4 -->
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="h-32 bg-muted rounded flex items-center justify-center">
            <p class="text-muted-foreground">Chart Placeholder</p>
          </div>
        </CardContent>
      </Card>

      <!-- Chart Card 5 -->
      <Card>
        <CardHeader>
          <CardTitle>Customer Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="h-32 bg-muted rounded flex items-center justify-center">
            <p class="text-muted-foreground">Chart Placeholder</p>
          </div>
        </CardContent>
      </Card>

      <!-- Chart Card 6 -->
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="h-32 bg-muted rounded flex items-center justify-center">
            <p class="text-muted-foreground">Chart Placeholder</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
</script>
