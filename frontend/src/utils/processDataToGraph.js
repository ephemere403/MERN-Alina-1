export const processDataToGraph = (apiData) => {
    try {

        if (apiData.length === 0) {
            return { hasData: false };
        }

        const dates = [...new Set(apiData.map(item => {
            const dateObj = new Date(item._id.date);
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0'); //January is 0!
            const year = dateObj.getFullYear();
            return `${day}-${month}-${year}`;
        }))].sort();
        const statuses = [...new Set(apiData.map(item => item._id.status))];

        const datasets = statuses.map(status => ({
            label: status,
            data: new Array(dates.length).fill(0),
            backgroundColor: getRandomColor(),
            maxBarThickness: 50
        }));

        apiData.forEach(item => {
            const dateObj = new Date(item._id.date);
            const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${dateObj.getFullYear()}`;
            const statusIndex = statuses.indexOf(item._id.status);
            const dateIndex = dates.indexOf(formattedDate);
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
                barPercentage: 0.8,
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
    };
}

const getRandomColor = () => {
    const r = Math.floor(Math.random() * 155 + 100);
    const g = Math.floor(Math.random() * 155 + 100);
    const b = Math.floor(Math.random() * 155 + 100);
    return `rgb(${r}, ${g}, ${b})`;
};