<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from "vue";
import type { TableColumn, TableRow } from "../../components/ui/DataTable.vue";
import DataTable from "../../components/ui/DataTable.vue";
import Pagination from "../../components/ui/Pagination.vue";
import AdminLayout from "../../components/layouts/AdminLayout.vue";
import { useFetch } from "../../composable/useFetch";
import { API_ENDPOINT } from "../../constants/endpoint";
import type { ApiResponse, User } from "../../types/res/dashboard";
import Dialog from "../../components/ui/Dialog.vue";
import UserEditForm from "../../components/container/form/UserEditForm.vue";
import UserDetailView from "../../components/container/form/UserDetailView.vue";
import { ToastError } from "../../utils/ToastUtils";
import { parseApiError } from "../../utils/ErrorHandler";

const offset = ref<number>(0);
const limit = ref<number>(5);
const total = ref<number>(0);
const selectedUser = ref<User | null>(null);
const isViewDialogOpen = ref<boolean>(false);
const isEditDialogOpen = ref<boolean>(false);
const userEditFormRef = ref<InstanceType<typeof UserEditForm> | null>(null);
const isEditLoading = ref<boolean>(false);
const editError = ref<string>("");
const apiUrl = computed(() => `${API_ENDPOINT}/admin?offset=${offset.value}&limit=${limit.value}`);

const {
  data,
  loading: isLoading,
  error: isError,
  refetch,
} = useFetch<ApiResponse<User[]>>(apiUrl.value);

const tableData = ref<TableRow[]>([]);

watch([offset, limit], () => {
  refetch();
});

watch(
  data,
  (newVal) => {
    if (newVal) {
      total.value = newVal.total || newVal.data.length;

      tableData.value = newVal.data.map((user, index) => ({
        id: offset.value + index + 1,
        accountId: user._id,
        name: user.name,
        date: user.date_of_birth,
        status: StatusBadge("Registered"),
        action: ActionButtons(user),
      }));
    }
  },
  { immediate: true }
);

const openUserDialog = (user: User) => {
  selectedUser.value = user;
  isViewDialogOpen.value = true;
};

const closeViewDialog = () => {
  isViewDialogOpen.value = false;
  selectedUser.value = null;
};

const openEditDialog = (user: User) => {
  closeViewDialog();
  selectedUser.value = user;
  isEditDialogOpen.value = true;
};

const closeEditDialog = () => {
  isEditDialogOpen.value = false;
  selectedUser.value = null;
  editError.value = "";
  isEditLoading.value = false;
};

const handleEditUser = (userId: string) => {
  const user = data.value?.data.find((u) => u._id === userId);
  if (user) {
    openEditDialog(user);
  } else {
    ToastError("User Not Found");
  }
};

const handleSaveUser = async (userData?: any) => {
  if (!userData && userEditFormRef.value) {
    try {
      await (userEditFormRef.value as any).handleSave();
    } catch (err: any) {
      const message = err.message || parseApiError(err);
      ToastError(message);
    }
    return;
  }

  closeEditDialog();
  refetch();
};

const handleEditLoading = (loading: boolean) => {
  isEditLoading.value = loading;
};

const handleEditError = (error: string) => {
  editError.value = error;
  ToastError(error);
};

const handleTableClick = (event: Event) => {
  const target = event.target as HTMLElement;
  const button = target.closest("button[data-user-id]");

  if (button) {
    const userId = button.getAttribute("data-user-id");
    const action = button.getAttribute("data-action");

    if (userId && action === "view") {
      const user = data.value?.data.find((u) => u._id === userId);
      if (user) {
        openUserDialog(user);
      }
    } else if (userId && action === "edit") {
      handleEditUser(userId);
    }
  }
};

onMounted(() => {
  document.addEventListener("click", handleTableClick);
});

onUnmounted(() => {
  document.removeEventListener("click", handleTableClick);
});

const handleOffsetChange = (newOffset: number) => {
  offset.value = newOffset;
};

const StatusBadge = (status: string) => `
  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
    ${status}
  </span>
`;

const ActionButtons = (user: User) => `
  <div class="flex space-x-2">
    <button data-user-id="${user._id}" data-action="view" class="view-user-btn inline-flex items-center px-2 py-1 text-xs text-orange-600 hover:text-orange-800">
      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
      </svg>
      Lihat
    </button>
    <button data-user-id="${user._id}" data-action="edit" class="edit-user-btn inline-flex items-center px-2 py-1 text-xs text-orange-600 hover:text-orange-800">
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
</script>

<template>
  <AdminLayout>
    <div class="space-y-4 md:space-y-6">
      <div class="bg-white rounded-lg p-4 md:p-6">
        <h1 class="font-bold text-xl md:text-3xl text-gray-900">User Aktif</h1>
      </div>

      <div class="bg-white rounded-md p-3">
        <DataTable
          :columns="columns"
          :rows="tableData"
          :isLoading="isLoading"
          :isError="!!isError"
          emptyStateMessage="Tidak ada data user yang tersedia"
        />

        <Pagination
          :offset="offset"
          :limit="limit"
          :total="total"
          @update:offset="handleOffsetChange"
        />

        <!-- View User Dialog -->
        <Dialog
          :isOpen="isViewDialogOpen"
          title="Lihat User"
          maxWidth="md"
          @close="closeViewDialog"
        >
          <UserDetailView v-if="selectedUser" :user="selectedUser" @edit="openEditDialog" />
        </Dialog>

        <!-- Edit User Dialog -->
        <Dialog :isOpen="isEditDialogOpen" title="Edit User" maxWidth="md" @close="closeEditDialog">
          <UserEditForm
            ref="userEditFormRef"
            v-if="selectedUser"
            :user="{
              id: selectedUser._id,
              name: selectedUser.name,
              gender: selectedUser.gender,
              birthDate: selectedUser.date_of_birth,
              email: selectedUser.email,
              phone: (selectedUser as any).phone || '',
              address: (selectedUser as any).address || '',
              profileImage: (selectedUser as any).profile_image,
            }"
            @save="handleSaveUser"
            @cancel="closeEditDialog"
            @loading="handleEditLoading"
            @error="handleEditError"
          />

          <template #footer>
            <button
              @click="handleSaveUser"
              :disabled="isEditLoading"
              class="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isEditLoading" class="flex items-center justify-center">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Menyimpan...
              </span>
              <span v-else>Simpan</span>
            </button>

            <!-- Error message in footer -->
            <div
              v-if="editError"
              class="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600"
            >
              {{ editError }}
            </div>
          </template>
        </Dialog>
      </div>
    </div>
  </AdminLayout>
</template>
