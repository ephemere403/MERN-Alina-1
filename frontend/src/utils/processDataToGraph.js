export const processDataToGraph = (apiData) => {
    try {

        if (apiData.length === 0) {
            return { hasData: false };
        }

        const dates = [...new Set(apiData.map(item => item._id.date))].sort();
        const statuses = [...new Set(apiData.map(item => item._id.status))];

        const datasets = statuses.map(status => ({
            label: status,
            data: new Array(dates.length).fill(0),
            backgroundColor: getRandomColor(),
        }));

        apiData.forEach(item => {
            const statusIndex = statuses.indexOf(item._id.status);
            const dateIndex = dates.indexOf(item._id.date);
            if (statusIndex > -1 && dateIndex > -1) {
                datasets[statusIndex].data[dateIndex] = item.count;
            }
        });

        return  {
            labels: dates,
            datasets: datasets,
            hasData: true
        };

    } catch (error) {
        throw error
    }
}

export const barChartOptions = (bar_title) => {
    return {
        plugins: {
            title: {
                display: true,
                text: bar_title,
            },
        },
        responsive: true,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
    };
}

const getRandomColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r}, ${g}, ${b})`;
};