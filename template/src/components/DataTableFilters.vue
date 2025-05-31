<template>
  <div class="space-y-6">
    <h3 class="text-lg font-semibold">Filters</h3>

    <!-- Search Input -->
    <div class="space-y-2">
      <Label for="search">Search</Label>
      <Input
        id="search"
        v-model="filters.search"
        placeholder="Search users..."
      />
    </div>

    <!-- Role Select -->
    <div class="space-y-2">
      <Label for="role">Role</Label>
      <Select v-model="filters.role">
        <SelectTrigger>
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="editor">Editor</SelectItem>
          <SelectItem value="viewer">Viewer</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Status Checkboxes -->
    <div class="space-y-2">
      <Label>Status</Label>
      <div class="space-y-2">
        <div class="flex items-center space-x-2">
          <Checkbox id="active" v-model:checked="filters.active" />
          <Label for="active">Active</Label>
        </div>
        <div class="flex items-center space-x-2">
          <Checkbox id="inactive" v-model:checked="filters.inactive" />
          <Label for="inactive">Inactive</Label>
        </div>
      </div>
    </div>

    <!-- Date Range -->
    <div class="space-y-2">
      <Label>Date Range</Label>
      <div class="grid grid-cols-1 gap-2">
        <Input
          v-model="filters.dateFrom"
          type="date"
          placeholder="From date"
        />
        <Input
          v-model="filters.dateTo"
          type="date"
          placeholder="To date"
        />
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="space-y-2">
      <Button @click="applyFilters" class="w-full">
        Apply Filters
      </Button>
      <Button @click="clearFilters" variant="outline" class="w-full">
        Clear Filters
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const filters = ref({
  search: '',
  role: 'all',
  active: true,
  inactive: false,
  dateFrom: '',
  dateTo: '',
});

const applyFilters = () => {
  console.log('Applying filters:', filters.value);
  // Placeholder for filter logic
};

const clearFilters = () => {
  filters.value = {
    search: '',
    role: 'all',
    active: true,
    inactive: false,
    dateFrom: '',
    dateTo: '',
  };
};
</script>
