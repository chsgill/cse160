class ShooterGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.score = 0;
    this.enemies = [];
    this.enemyCount = 10;
    this.enemyRadius = 15;
    this.camSpeed = 15;
    this.cameraOffsetX = 0;
    this.direction = 0;
    this.health = 100;
    this.healthDrainRate = 0.01;
    this.gameStart = false;

    this.mouseX = this.canvas.width / 2;
    this.mouseY = this.canvas.height / 2;


    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseleave', () => this.direction = 0);
    this.canvas.addEventListener('click', this.handleClick.bind(this));

    for (let i = 0; i < this.enemyCount; i++) this.spawnEnemy();
  }

  spawnEnemy() {
    const x = Math.random() * 2000 - 1000;
    const y = Math.random() * 400;
    this.enemies.push({ x, y, alive: true });
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;

    if (this.mouseX < 50) this.direction = -1;
    else if (this.mouseX > 350) this.direction = 1;
    else this.direction = 0;
  }

  handleClick(e) {
    if(!this.gameStart) this.gameStart = true;
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    this.enemies.forEach(enemy => {
      const screenX = enemy.x - this.cameraOffsetX;
      const screenY = enemy.y;

      const dist = Math.hypot(screenX - mouseX, screenY - mouseY);
      if (dist < this.enemyRadius && enemy.alive) {
        enemy.alive = false;
        this.score++;
        this.spawnEnemy();
        this.health += this.score;
        this.healthDrainRate += 0.001;
      }
    });
  }

  updateHealth() {
    let offscreenEnemies = this.enemies.filter(enemy =>
      enemy.alive &&
      (enemy.x - this.cameraOffsetX < 0 || enemy.x - this.cameraOffsetX > this.canvas.width)
    ).length;
  
    this.health -= offscreenEnemies * this.healthDrainRate;
  
    if (this.health > 100) this.health = 100;
    if (this.health < 0){ this. gameStart = false; this.health = 100; this.healthDrainRate = 0; this.score = 0; }
  }

  drawHealthBar() {
    const barHeight = 280;
    const barWidth = 8;
    const margin = 10;
  
    const centerY = this.canvas.height / 2;
    const healthRatio = this.health / 100;
    const filledHeight = barHeight * healthRatio;
    const topY = centerY - (barHeight / 2);
    const fillTopY = centerY - (filledHeight / 2);
    const rightX = this.canvas.width - barWidth - margin;
      
    const red = Math.floor(255 * (1 - healthRatio));
    const green = Math.floor(255 * healthRatio);
    const color = `rgb(${red},${green},0)`;
  
    this.ctx.fillStyle = 'grey';
    this.ctx.fillRect(margin, topY, barWidth, barHeight);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(margin, fillTopY, barWidth, filledHeight);
    this.ctx.fillRect(rightX, fillTopY, barWidth, filledHeight);
    this.ctx.strokeStyle = 'white';
    this.ctx.strokeRect(margin, topY, barWidth, barHeight);
  
    this.ctx.fillStyle = 'grey';
    this.ctx.fillRect(rightX, topY, barWidth, barHeight);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(rightX, fillTopY, barWidth, filledHeight);
    this.ctx.strokeStyle = 'white';
    this.ctx.strokeRect(rightX, topY, barWidth, barHeight);
  
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(50, 50, 300, 300);
  }


  drawCrosshair() {
    const ctx = this.ctx;
    const { width, height } = this.canvas;
    const x = this.mouseX;
    const y = this.mouseY;
  
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;
  
    ctx.beginPath();
    // From each corner to the mouse position
    ctx.moveTo(0, 0);
    ctx.lineTo(x, y);
  
    ctx.moveTo(width, 0);
    ctx.lineTo(x, y);
  
    ctx.moveTo(0, height);
    ctx.lineTo(x, y);
  
    ctx.moveTo(width, height);
    ctx.lineTo(x, y);
  
    ctx.stroke();
    /*
    this.ctx.beginPath();
    this.ctx.arc(x, y, 5, 0, Math.PI * 2);
    this.ctx.fillStyle = 'red';
    this.ctx.strokeStyle = 'red';
    this.ctx.stroke();
    */
}


  updateCamera() {
    this.cameraOffsetX += this.direction * this.camSpeed;
  }

  getClosestEnemy() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
  
    let closestEnemy = null;
    let closestDistance = Infinity;
  
    this.enemies.forEach(enemy => {
      if (enemy.alive) {
        const screenX = enemy.x - this.cameraOffsetX;
        const screenY = enemy.y;
  
        const distance = Math.hypot(screenX - centerX, screenY - centerY);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestEnemy = enemy;
        }
      }
    });
    return closestEnemy;
  }

  drawHUD() {
    this.ctx.fillStyle = 'limegreen';
    this.ctx.font = '16px monospace';
    this.ctx.fillText(`${this.score}`, 190, 380);

    const closestEnemy = this.getClosestEnemy();
    if (closestEnemy) {
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;

      const enemyX = closestEnemy.x - this.cameraOffsetX;
      const enemyY = closestEnemy.y;

      if(enemyX > 400) this.ctx.fillText(`(${Math.round(enemyX)})>`, 220, 20);
      else if(enemyX < 0) this.ctx.fillText(`<(${Math.round(enemyX)})`, 110, 20);

      //this.ctx.fillText(`Closest Enemy: (${Math.round(enemyX)}, ${Math.round(enemyY)})`, 200, 20);
      else this.ctx.fillText(`ONSIGHT`, 165, 20);
    }
    this.drawHealthBar();
    
  }

  drawEnemies() {
    this.enemies.forEach(enemy => {
      if (!enemy.alive) return;
      const x = enemy.x - this.cameraOffsetX;
      const y = enemy.y;

      if (x + this.enemyRadius >= 0 && x - this.enemyRadius <= this.canvas.width) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.enemyRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'red';
        this.ctx.fill();
        this.ctx.strokeStyle = 'white';
        this.ctx.stroke();
      }
    });
  }

  gameLoop() {
    if(!this.gameStart) this.showMenu();
    else {
    this.updateCamera();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = 'royalblue';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawEnemies();
    this.updateHealth();
    this.drawHUD();
    this.drawCrosshair(); }
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  showMenu() {
    this.ctx.fillStyle = 'midnightblue';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'limegreen';
    this.ctx.font = '16px monospace';
    this.ctx.fillText(`congrats! you are the new recruit piloting`, 13, 20);
    this.ctx.font = '24px monospace';
    this.ctx.fillText(`THE ALGORITHM`, 100, 70);
    this.ctx.font = '16px monospace';
    this.ctx.fillText(`locate the red targets by moving your cursor`, 5, 120);
    this.ctx.fillText(`towards the sides, click on them to dispatch.`, 5, 140);
    this.ctx.fillText(`your life is in the hands of THE ALGORITHM.`, 5, 160);
    this.ctx.fillText(`you will improve or be disposed of.`, 5, 180);
    this.ctx.fillText(`do not question the objective`, 5, 220);
    this.ctx.fillText(`[click to start]`, 5, 300);
  }

  start() {
    this.gameLoop();
  }
}
