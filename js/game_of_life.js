// Conway's Game of Life Implementation
function initGameOfLife() {
    const canvas = document.getElementById('gameOfLifeCanvas');
    if (!canvas) {
        console.error('canvas not found');
        return;
    }

    const ctx = canvas.getContext('2d');
    const cellSize = 20;
    let cols, rows;
    let grid = [];
    let animationId;

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        cols = Math.floor(canvas.width / cellSize);
        rows = Math.floor(canvas.height / cellSize);
        initGrid();
    }

    function initGrid() {
        grid = [];
        for (let i = 0; i < rows; i++) {
            grid[i] = [];
            for (let j = 0; j < cols; j++) {
                // Random initialization with 35% chance of being alive
                grid[i][j] = Math.random() > 0.90 ? 1 : 0;
            }
        }
    }

    function countNeighbors(x, y) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const row = (x + i + rows) % rows;
                const col = (y + j + cols) % cols;
                count += grid[row][col];
            }
        }
        return count;
    }

    function updateGrid() {
        const newGrid = [];
        for (let i = 0; i < rows; i++) {
            newGrid[i] = [];
            for (let j = 0; j < cols; j++) {
                const neighbors = countNeighbors(i, j);
                const current = grid[i][j];

                // Conway's Game of Life rules
                if (current === 1) {
                    newGrid[i][j] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
                } else {
                    newGrid[i][j] = (neighbors === 3) ? 1 : 0;
                }
            }
        }
        grid = newGrid;
    }

    function draw() {
        // Clear canvas with white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw cells with subtle grid
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (grid[i][j] === 1) {
                    // Light subtle color for alive cells - more visible
                    // ctx.fillStyle = 'rgba(10, 250, 250, 0.2)'; // Light cyan
                    ctx.fillStyle = 'rgba(200, 200, 200, 0.5)'; // Light gray
                    ctx.fillRect(j * cellSize, i * cellSize, cellSize - 1, cellSize - 1);
                }
            }
        }
    }

    function animate() {
        draw();
        updateGrid();
        animationId = setTimeout(() => requestAnimationFrame(animate), 500);
    }

    // Initialize
    resizeCanvas();
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationId);
        resizeCanvas();
        animate();
    });
}