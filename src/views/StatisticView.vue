<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStatisticStore } from '@/stores/statistic.store';
import VButton from '@/components/common/VButton.vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const statisticStore = useStatisticStore();
const currentYear = new Date().getFullYear();

const selectedMonth = ref(new Date().getMonth() + 1);
const selectedYear = ref(currentYear);

const months = [
    { value: 1, text: 'January' }, { value: 2, text: 'February' }, { value: 3, text: 'March' },
    { value: 4, text: 'April' }, { value: 5, text: 'May' }, { value: 6, text: 'June' },
    { value: 7, text: 'July' }, { value: 8, text: 'August' }, { value: 9, text: 'September' },
    { value: 10, text: 'October' }, { value: 11, text: 'November' }, { value: 12, text: 'December' },
];
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

const chartData = computed(() => {
    const data = statisticStore.chartData;
    return {
        labels: data.map(d => d.propertyName),
        datasets: [{
            label: `Most Property Income (${selectedMonth.value}/${selectedYear.value})`,
            backgroundColor: '#3b82f6',
            data: data.map(d => d.totalIncome)
        }]
    };
});

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false
};

const showStatistics = () => {
    statisticStore.fetchChartData(selectedMonth.value, selectedYear.value);
};

onMounted(() => {
    showStatistics(); // Tampilkan data untuk bulan & tahun saat ini saat halaman dimuat
});
</script>

<template>
  <main class="min-h-screen bg-blue-50/30 pt-28 pb-10 px-4 sm:px-6 lg:px-8">
    <div class="container mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
        <h1 class="text-xl font-bold text-gray-800 mb-4">Property Income Statistic</h1>
        
        <!-- Filter Section -->
        <div class="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
                <label class="block text-sm font-medium text-gray-700">Month</label>
                <select v-model.number="selectedMonth" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                    <option v-for="month in months" :key="month.value" :value="month.value">
                        {{ month.text }}
                    </option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Year</label>
                <select v-model.number="selectedYear" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                    <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                </select>
            </div>
            <VButton @click="showStatistics" class="self-end">Show Statistic</VButton>
        </div>

        <!-- Chart Section -->
        <div class="h-96 relative">
            <div v-if="statisticStore.loading" class="absolute inset-0 flex items-center justify-center">Loading chart...</div>
            <div v-else-if="statisticStore.error" class="text-red-500">{{ statisticStore.error }}</div>
            <Bar v-else :data="chartData" :options="chartOptions" />
        </div>
    </div>
  </main>
</template>