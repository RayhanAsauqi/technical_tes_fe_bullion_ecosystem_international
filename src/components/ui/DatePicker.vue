<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  id?: string;
  label?: string;
  modelValue: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "change", value: string): void;
}>();

const isOpen = ref(false);
const calendarRef = ref<HTMLDivElement | null>(null);
const currentDate = ref(new Date());

const displayText = computed(() => {
  if (props.modelValue) {
    const date = new Date(props.modelValue);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }
  return props.placeholder || "Pilih tanggal";
});

const toggleCalendar = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value;
  }
};

const selectDate = (date: Date) => {
  const formattedDate = date.toISOString().split("T")[0];
  emit("update:modelValue", formattedDate);
  emit("change", formattedDate);
  isOpen.value = false;
};

const previousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  );
};

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  );
};

const getCurrentMonthDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }

  return days;
});

const isSelectedDate = (date: Date | null) => {
  if (!date || !props.modelValue) return false;
  return date.toISOString().split("T")[0] === props.modelValue;
};

const isToday = (date: Date | null) => {
  if (!date) return false;
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const isDisabledDate = (date: Date | null) => {
  if (!date) return false;
  const dateStr = date.toISOString().split("T")[0];
  if (props.minDate && dateStr < props.minDate) return true;
  if (props.maxDate && dateStr > props.maxDate) return true;
  return false;
};

// Close calendar when clicking outside
const handleClickOutside = (event: Event) => {
  if (calendarRef.value && !calendarRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

import { onMounted, onUnmounted } from "vue";

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="mb-4" ref="calendarRef">
    <label v-if="label" :for="id" class="block text-sm font-semibold pb-4">
      {{ label }}
    </label>

    <div class="relative">
      <!-- Calendar Button -->
      <button
        type="button"
        :id="id"
        @click="toggleCalendar"
        :disabled="disabled"
        :class="[
          'w-full flex items-center justify-between px-4 py-3.5 text-left border rounded-md shadow-sm focus:outline-none transition-colors duration-200',
          {
            'border-red-500 focus:ring-red-500': error,
            'border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500':
              !error && !disabled,
            'bg-gray-100 border-gray-200 cursor-not-allowed': disabled,
            'bg-white hover:bg-gray-50': !disabled,
          },
        ]"
      >
        <!-- Selected Text -->
        <span
          :class="[
            'text-sm truncate',
            {
              'text-gray-500': !modelValue,
              'text-gray-900': modelValue,
              'text-gray-400': disabled,
            },
          ]"
        >
          {{ displayText }}
        </span>

        <!-- Calendar Icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          :class="[
            'w-5 h-5',
            {
              'text-orange-500': !disabled,
              'text-gray-400': disabled,
            },
          ]"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
          />
        </svg>
      </button>

      <!-- Calendar Dropdown -->
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          class="absolute z-10 w-80 mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
        >
          <!-- Calendar Header -->
          <div class="flex items-center justify-between p-4 border-b">
            <button type="button" @click="previousMonth" class="p-1 hover:bg-gray-100 rounded">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <h3 class="text-sm font-medium">
              {{ currentDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" }) }}
            </h3>

            <button type="button" @click="nextMonth" class="p-1 hover:bg-gray-100 rounded">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <!-- Calendar Grid -->
          <div class="p-4">
            <!-- Day Headers -->
            <div class="grid grid-cols-7 gap-1 mb-2">
              <div
                v-for="day in ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']"
                :key="day"
                class="text-xs font-medium text-gray-500 text-center py-1"
              >
                {{ day }}
              </div>
            </div>

            <!-- Calendar Days -->
            <div class="grid grid-cols-7 gap-1">
              <button
                v-for="(date, index) in getCurrentMonthDays"
                :key="index"
                type="button"
                @click="date && !isDisabledDate(date) ? selectDate(date) : null"
                :disabled="!date || isDisabledDate(date)"
                :class="[
                  'h-8 text-sm rounded transition-colors',
                  {
                    'text-gray-400': !date,
                    'hover:bg-gray-100': date && !isDisabledDate(date) && !isSelectedDate(date),
                    'bg-orange-500 text-white': date && isSelectedDate(date),
                    'bg-blue-100 text-blue-600': date && isToday(date) && !isSelectedDate(date),
                    'text-gray-900':
                      date && !isSelectedDate(date) && !isToday(date) && !isDisabledDate(date),
                    'text-gray-300 cursor-not-allowed': date && isDisabledDate(date),
                  },
                ]"
              >
                {{ date?.getDate() }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>
