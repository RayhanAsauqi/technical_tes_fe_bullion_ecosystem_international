<script setup lang="ts">
import { ref } from "vue";
import type { TableColumn, TableRow } from "../../components/ui/DataTable.vue";
import DataTable from "../../components/ui/DataTable.vue";
import AdminLayout from "../../components/layouts/AdminLayout.vue";

const userData = ref<TableRow[]>([
  {
    id: 1,
    accountId: "#20462",
    name: "Matt Dickerson",
    date: "13/05/2022",
    status: "Registered",
  },
  {
    id: 2,
    accountId: "#18933",
    name: "Wiktoria",
    date: "22/05/2022",
    status: "Registered",
  },
  {
    id: 3,
    accountId: "#45169",
    name: "Trixie Byrd",
    date: "15/06/2022",
    status: "Registered",
  },
  {
    id: 4,
    accountId: "#34304",
    name: "Brad Mason",
    date: "06/09/2022",
    status: "Registered",
  },
  {
    id: 5,
    accountId: "#17188",
    name: "Sanderson",
    date: "25/09/2022",
    status: "Registered",
  },
  {
    id: 6,
    accountId: "#73003",
    name: "Jun Redfern",
    date: "04/10/2022",
    status: "Registered",
  },
  {
    id: 7,
    accountId: "#58825",
    name: "Miriam Kidd",
    date: "17/10/2022",
    status: "Registered",
  },
  {
    id: 8,
    accountId: "#44122",
    name: "Dominic",
    date: "24/10/2022",
    status: "Registered",
  },
  {
    id: 9,
    accountId: "#89094",
    name: "Shanice",
    date: "01/11/2022",
    status: "Registered",
  },
  {
    id: 10,
    accountId: "#85252",
    name: "Poppy-Rose",
    date: "22/11/2022",
    status: "Registered",
  },
]);

const StatusBadge = (status: string) => `
  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
    ${status}
  </span>
`;

const ActionButtons = () => `
  <div class="flex space-x-2">
    <button class="inline-flex items-center px-2 py-1 text-xs text-orange-600 hover:text-orange-800">
      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
      </svg>
      Lihat
    </button>
    <button class="inline-flex items-center px-2 py-1 text-xs text-orange-600 hover:text-orange-800">
      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
      </svg>
      Edit
    </button>
  </div>
`;

const columns: TableColumn[] = [
  { key: "accountId", title: "Account ID", width: "15%" },
  { key: "name", title: "Name", width: "25%" },
  { key: "date", title: "Date", width: "20%" },
  { key: "status", title: "Status", width: "20%" },
  { key: "action", title: "Action", width: "20%" },
];

const tableData = ref<TableRow[]>(
  userData.value.map((user) => ({
    ...user,
    status: StatusBadge(user.status),
    action: ActionButtons(),
  }))
);

const isLoading = ref<boolean>(false);
const isError = ref<boolean>(false);
</script>

<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="bg-white rounded-lg p-4 md:p-6">
        <h1 class="font-bold text-xl md:text-3xl text-gray-900">User Aktif</h1>
      </div>

      <div class="bg-white rounded-md p-3">
        <DataTable
          :columns="columns"
          :rows="tableData"
          :isLoading="isLoading"
          :isError="isError"
          emptyStateMessage="Tidak ada data user yang tersedia"
        />

        <div class="flex justify-end items-center mt-4 md:mt-6 space-x-1 md:space-x-2">
          <button
            class="px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm text-gray-500 hover:text-gray-700"
          >
            Previous
          </button>
          <button
            class="px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm bg-bullion-orange text-white rounded"
          >
            1
          </button>
          <button
            class="px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm text-gray-700 hover:text-gray-900"
          >
            2
          </button>
          <button
            class="px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm text-gray-700 hover:text-gray-900"
          >
            3
          </button>
          <button
            class="px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm text-gray-700 hover:text-gray-900"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
