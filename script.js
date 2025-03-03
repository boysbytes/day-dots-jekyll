document.addEventListener('DOMContentLoaded', function() {
    const daysContainer = document.getElementById('daysContainer');
    const dayPopup = document.getElementById('dayPopup');
    const popupTitle = document.getElementById('popupTitle');
    const popupContent = document.getElementById('popupContent');
    const closePopup = document.getElementById('closePopup');

    // Fetch and process data from days.json
   fetch('_data/days.json')
        .then(response => response.json())
        .then(daysData => {
            generateDays(daysData);
        })
        .catch(error => {
            console.error('Error fetching days data:', error);
            // If the fetch fails, generateDays with an empty object
            generateDays({});
        });

    function generateDays(daysData) {
        // Determine start and end dates based on JSON entries
        let startDate, endDate;
        const dates = Object.keys(daysData);

        if (dates.length > 0) {
            // Sort date keys (ISO format sorts chronologically as strings)
            const sortedDates = dates.sort();
            startDate = new Date(sortedDates[0]); // earliest date
            const lastDate = new Date(sortedDates[sortedDates.length - 1]);

            // endDate = one year after the last date in daysData
            endDate = new Date(lastDate);
            endDate.setFullYear(lastDate.getFullYear() + 1);
        } else {
            // If no data, default to current year start -> today
            startDate = new Date(new Date().getFullYear(), 0, 1);
            endDate = new Date();
        }

        console.log("Start Date:", startDate);
        console.log("End Date:", endDate);

        // Calculate total days between startDate and endDate
        const timeDiff = endDate.getTime() - startDate.getTime();
        const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        // Generate a day element for each date in the range
        for (let i = 0; i <= dayDiff; i++) {
            // Increment by exactly 24 hours per day
            const currentDate = new Date(startDate.getTime() + i * 86400000);
            const dateKey = formatDate(currentDate);
            const dayDetails = daysData[dateKey];


            if (dayDetails) {
                // If there's an entry for this date, show a clickable title
                const dayTitleElement = document.createElement('div');
                dayTitleElement.classList.add('day-title');
                dayTitleElement.textContent = dayDetails.title;
                dayTitleElement.addEventListener('click', () => openPopup(dateKey, dayDetails));

                // Add tooltip with formatted date to day-title elements
                const tooltipDate = currentDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                dayTitleElement.title = tooltipDate; // Set tooltip text


                daysContainer.appendChild(dayTitleElement);
            } else {
                // Otherwise, show a period symbol
                const dayPeriodElement = document.createElement('div');
                dayPeriodElement.classList.add('day-period');
                dayPeriodElement.textContent = '•';

                // Add tooltip with formatted date
                const tooltipDate = currentDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                dayPeriodElement.title = tooltipDate; // Set tooltip text

                // Compare currentDate to "today" for color-coding
                const today = new Date();

                // Convert both dates to strings to avoid time zone edge cases
                if (currentDate.toDateString() === today.toDateString()) {
                    dayPeriodElement.classList.add('today');
                } else if (currentDate > today) {
                    dayPeriodElement.classList.add('future');
                } else {
                    dayPeriodElement.classList.add('past');
                }

                daysContainer.appendChild(dayPeriodElement);
            }
        }
    }

    // Format a Date object as YYYY-MM-DD
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Open the popup with the details for a specific date
    function openPopup(dateKey, dayDetails) {
        popupTitle.textContent = dayDetails.title;
        popupContent.innerHTML = ''; // Clear previous content

        // Show a formatted date
        const dateElement = document.createElement('h3');
        const date = new Date(dateKey);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        dateElement.textContent = formattedDate;
        popupContent.appendChild(dateElement);

        // Convert Markdown to HTML
        const textContentElement = document.createElement('div');
        textContentElement.innerHTML = marked.parse(dayDetails.content);
        popupContent.appendChild(textContentElement);

        // If there are images, add them
        if (dayDetails.images && Array.isArray(dayDetails.images)) {
            dayDetails.images.forEach(imageName => {
                const imgElement = document.createElement('img');
                imgElement.src = `images/${imageName}`;
                imgElement.style.maxWidth = '100%';
                imgElement.style.height = 'auto';
                popupContent.appendChild(imgElement);
            });
        }

        dayPopup.style.display = "block";
    }

    // Close the popup when clicking the close button
    closePopup.onclick = function() {
        dayPopup.style.display = "none";
    };

    // Close the popup if user clicks outside the popup content
    window.onclick = function(event) {
        if (event.target === dayPopup) {
            dayPopup.style.display = "none";
        }
    };
});