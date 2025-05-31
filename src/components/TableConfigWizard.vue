<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Configure Table</DialogTitle>
        <DialogDescription>
          Step {{ currentStep }} of 3: {{ stepTitles[currentStep - 1] }}
        </DialogDescription>
      </DialogHeader>

      <div class="py-4">
        <!-- Step 1: Columns -->
        <div v-if="currentStep === 1" class="space-y-4">
          <h4 class="font-medium">Select Columns to Display</h4>
          <div class="space-y-2">
            <div v-for="column in availableColumns" :key="column.key" class="flex items-center space-x-2">
              <Checkbox
                :id="column.key"
                v-model:checked="column.selected"
              />
              <Label :for="column.key">{{ column.label }}</Label>
            </div>
          </div>
        </div>

        <!-- Step 2: Sorting -->
        <div v-if="currentStep === 2" class="space-y-4">
          <h4 class="font-medium">Configure Sorting</h4>
          <div class="space-y-2">
            <Label for="sort-column">Sort By</Label>
            <Select v-model="sortConfig.column">
              <SelectTrigger>
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="column in selectedColumns" :key="column.key" :value="column.key">
                  {{ column.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <Label>Sort Order</Label>
            <div class="flex space-x-4">
              <div class="flex items-center space-x-2">
                <Checkbox id="asc" :checked="sortConfig.order === 'asc'" @update:checked="sortConfig.order = 'asc'" />
                <Label for="asc">Ascending</Label>
              </div>
              <div class="flex items-center space-x-2">
                <Checkbox id="desc" :checked="sortConfig.order === 'desc'" @update:checked="sortConfig.order = 'desc'" />
                <Label for="desc">Descending</Label>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Pagination -->
        <div v-if="currentStep === 3" class="space-y-4">
          <h4 class="font-medium">Pagination Settings</h4>
          <div class="space-y-2">
            <Label for="page-size">Items per page</Label>
            <Select v-model="paginationConfig.pageSize">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="flex items-center space-x-2">
            <Checkbox id="show-pagination" v-model:checked="paginationConfig.enabled" />
            <Label for="show-pagination">Enable pagination</Label>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button v-if="currentStep > 1" @click="previousStep" variant="outline">
          Previous
        </Button>
        <Button v-if="currentStep < 3" @click="nextStep">
          Next
        </Button>
        <Button v-if="currentStep === 3" @click="finishWizard">
          Finish
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  open: boolean;
}

defineProps<Props>();
defineEmits<{
  'update:open': [value: boolean];
}>();

const currentStep = ref(1);
const stepTitles = ['Column Selection', 'Sorting Options', 'Pagination Settings'];

const availableColumns = ref([
  { key: 'id', label: 'ID', selected: true },
  { key: 'name', label: 'Name', selected: true },
  { key: 'email', label: 'Email', selected: true },
  { key: 'role', label: 'Role', selected: true },
  { key: 'status', label: 'Status', selected: false },
  { key: 'created', label: 'Created Date', selected: false },
]);

const sortConfig = ref({
  column: 'name',
  order: 'asc' as 'asc' | 'desc',
});

const paginationConfig = ref({
  pageSize: '25',
  enabled: true,
});

const selectedColumns = computed(() =>
  availableColumns.value.filter(col => col.selected)
);

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++;
  }
};

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const finishWizard = () => {
  console.log('Wizard completed with config:', {
    columns: selectedColumns.value,
    sort: sortConfig.value,
    pagination: paginationConfig.value,
  });
  // Reset wizard
  currentStep.value = 1;
  // Close dialog
  // emit('update:open', false);
};
</script>
