document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const timeBlocksContainer = document.getElementById('time-blocks');
    const currentDateElement = document.getElementById('current-date');
    const currentTimeElement = document.getElementById('current-time');
    const resetBtn = document.getElementById('reset-btn');
    const themeToggle = document.getElementById('theme-toggle');
    
    // Time variables
    const workHoursStart = 6; // 6 AM
    const workHoursEnd = 22; // 10 PM
    let currentHour = new Date().getHours();
    
    // Initialize the planner
    function initPlanner() {
        updateDateTime();
        generateTimeBlocks();
        loadTasks();
        setInterval(updateDateTime, 60000); // Update time every minute
    }
    
    // Update current date and time
    function updateDateTime() {
        const now = new Date();
        currentDateElement.textContent = now.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        currentTimeElement.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Check if hour changed to update time block colors
        const newHour = now.getHours();
        if (newHour !== currentHour) {
            currentHour = newHour;
            updateTimeBlockColors();
        }
    }
    
    // Generate time blocks from 6 AM to 10 PM
    function generateTimeBlocks() {
        timeBlocksContainer.innerHTML = '';
        
        for (let hour = workHoursStart; hour <= workHoursEnd; hour++) {
            const timeBlock = document.createElement('div');
            timeBlock.classList.add('time-block');
            
            // Format hour for display
            const displayHour = formatHour(hour);
            
            // Create hour label
            const hourElement = document.createElement('div');
            hourElement.classList.add('hour');
            hourElement.textContent = displayHour;
            
            // Create textarea for task
            const description = document.createElement('textarea');
            description.classList.add('description');
            description.setAttribute('data-hour', hour);
            description.placeholder = `Enter task for ${displayHour}`;
            
            // Create save button
            const saveBtn = document.createElement('button');
            saveBtn.classList.add('save-btn');
            saveBtn.innerHTML = '<i class="fas fa-save"></i>';
            saveBtn.addEventListener('click', saveTask);
            
            // Create delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteBtn.addEventListener('click', deleteTask);
            
            // Create actions container
            const actions = document.createElement('div');
            actions.classList.add('actions');
            actions.appendChild(saveBtn);
            actions.appendChild(deleteBtn);
            
            // Assemble time block
            timeBlock.appendChild(hourElement);
            timeBlock.appendChild(description);
            timeBlock.appendChild(actions);
            
            timeBlocksContainer.appendChild(timeBlock);
        }
        
        updateTimeBlockColors();
    }
    
    // Format hour to 12-hour time with AM/PM
    function formatHour(hour) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour.toString().padStart(2, '0')}:00 ${period}`;
    }
    
    // Update time block colors based on current time
    function updateTimeBlockColors() {
        const timeBlocks = document.querySelectorAll('.time-block');
        
        timeBlocks.forEach(block => {
            const hourElement = block.querySelector('.hour');
            const hour = parseInt(hourElement.textContent.split(':')[0]);
            const period = hourElement.textContent.split(' ')[1];
            const militaryHour = period === 'PM' ? (hour === 12 ? 12 : hour + 12) : (hour === 12 ? 0 : hour);
            
            block.classList.remove('past', 'present', 'future');
            
            if (militaryHour < currentHour) {
                block.classList.add('past');
            } else if (militaryHour === currentHour) {
                block.classList.add('present');
            } else {
                block.classList.add('future');
            }
        });
    }
    
    // Save task to localStorage
    function saveTask(e) {
        const timeBlock = e.target.closest('.time-block');
        const hour = timeBlock.querySelector('.description').getAttribute('data-hour');
        const task = timeBlock.querySelector('.description').value;
        
        let tasks = JSON.parse(localStorage.getItem('dailyPlannerTasks')) || {};
        tasks[hour] = task;
        localStorage.setItem('dailyPlannerTasks', JSON.stringify(tasks));
        
        // Show feedback
        const feedback = document.createElement('div');
        feedback.textContent = 'Task saved!';
        feedback.style.position = 'fixed';
        feedback.style.bottom = '20px';
        feedback.style.right = '20px';
        feedback.style.backgroundColor = 'var(--success-color)';
        feedback.style.color = 'white';
        feedback.style.padding = '10px 20px';
        feedback.style.borderRadius = '5px';
        feedback.style.zIndex = '1000';
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.style.opacity = '0';
            setTimeout(() => feedback.remove(), 500);
        }, 2000);
    }
    
    // Delete task from localStorage
    function deleteTask(e) {
        const timeBlock = e.target.closest('.time-block');
        const hour = timeBlock.querySelector('.description').getAttribute('data-hour');
        const description = timeBlock.querySelector('.description');
        
        let tasks = JSON.parse(localStorage.getItem('dailyPlannerTasks')) || {};
        delete tasks[hour];
        localStorage.setItem('dailyPlannerTasks', JSON.stringify(tasks));
        
        description.value = '';
    }
    
    // Load tasks from localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('dailyPlannerTasks')) || {};
        
        Object.keys(tasks).forEach(hour => {
            const description = document.querySelector(`.description[data-hour="${hour}"]`);
            if (description) {
                description.value = tasks[hour];
            }
        });
    }
    
    // Reset all tasks
    resetBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete all tasks?')) {
            localStorage.removeItem('dailyPlannerTasks');
            document.querySelectorAll('.description').forEach(desc => {
                desc.value = '';
            });
        }
    });
    
    // Theme toggle functionality
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        }
    });
    
    // Check for saved theme preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    }
    
    // Initialize the planner
    initPlanner();
});