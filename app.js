const gameField = document.querySelector('.game-field')
const reactionImage = document.querySelector('.reaction-image')
const timerOneDigitNumber = document.querySelector('.timer__one-digit-number')
const timerTwoDigitNumber = document.querySelector('.timer__two-digit-number')
const timerThreeDigitNumber = document.querySelector('.timer__three-digit-number')
const bombsOneDigitNumber = document.querySelector('.bombs__one-digit-number')
const bombsTwoDigitNumber = document.querySelector('.bombs__two-digit-number')
const bombsThreeDigitNumber = document.querySelector('.bombs__three-digit-number')

getReadyGame()

function getReadyGame(width = 16, height = 16, bombsCount = 40) {

  let timer

  setBombsCounter(bombsCount)

  reactionImage.addEventListener('mousedown', (e) => {
    e.preventDefault()
    reactionImage.src = './assets/minesweeper-sprites/clicked_smile_face.png'
  })

  reactionImage.addEventListener('mouseup', (e) => {
    e.preventDefault()
    reactionImage.src = './assets/minesweeper-sprites/smile_face.png'
    stopTimer()
    getReadyGame()
  })

  let cellsCount = width * height
  gameField.innerHTML = '<button></button>'.repeat(cellsCount)
  const cells = [...gameField.children]

  bombsIndexes = [...Array(cellsCount).keys()]
    .sort(() => Math.random() - 0.5)
    .slice(0, bombsCount)

  gameField.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') {
      return
    }

    const index = cells.indexOf(e.target)
    const row = Math.floor(index / width)
    const column = index % width

    openCell(row, column)

  })

  gameField.addEventListener('mousedown', (e) => {
    e.preventDefault()
    if (e.target.tagName !== 'BUTTON') {
      return
    }
    reactionImage.src = './assets/minesweeper-sprites/impress_face.png'
    e.target.style.background = `url('./assets/minesweeper-sprites/opened_cell.png')`
  })

  gameField.addEventListener('mouseup', (e) => {
    e.preventDefault()
    if (e.target.tagName !== 'BUTTON') {
      return
    }
    reactionImage.src = './assets/minesweeper-sprites/smile_face.png'
  })

  function openCell(row, column) {

    if (!isValid(row, column)) return

    const index = row * width + column
    const cell = cells[index]
    const minesCount = getMinesCount(row, column)

    if (cell.disabled) return

    cell.disabled = true

    if (isBomb(row, column)) {
      cell.style.background = "url(./assets/minesweeper-sprites/bomb.png)"
      gameOver()
      return
    }

    if (cellsCount <= bombsCount) {
      victory()
      return
    }

    cellsCount--

    if (cellsCount === (width * height - 1)) {
      stopTimer()
      startTimer()
    }

    if (minesCount) {
      cell.style.background = `url(./assets/minesweeper-sprites/bombs_around_count_${minesCount}.png)`
      return
    }
    else {
      cell.style.background = "url(./assets/minesweeper-sprites/opened_cell.png)"
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          openCell(row + y, column + x)
        }
      }
    }

  }

  function getMinesCount(row, column) {
    count = 0
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (isBomb(row + y, column + x)) {
          count++
        }
      }
    }
    return count
  }

  function isBomb(row, column) {
    const index = row * width + column

    return bombsIndexes.includes(index)
  }

  function isValid(row, column) {
    return row >= 0 && row < height && column >= 0 && column < width
  }

  function openAllCells() {
    cells.forEach((_, index) => {
      const row = Math.floor(index / width)
      const column = index % width
      openCell(row, column)
    })
  }

  function victory() {
    reactionImage.src = './assets/minesweeper-sprites/victory_face.png'
    stopTimer()
  }

  function gameOver() {
    reactionImage.src = './assets/minesweeper-sprites/loss_face.png'
    stopTimer()
    openAllCells()
  }

  function startTimer() {
    seconds = 0
    timer = setInterval(() => {
      const currentSecond = String(seconds)
      secondsArray = ([...currentSecond])
      if (secondsArray.length === 1) {
        timerOneDigitNumber.src = `./assets/minesweeper-sprites/timer_${secondsArray[0]}.png`
      }
      else if (secondsArray.length === 2) {
        timerOneDigitNumber.src = `./assets/minesweeper-sprites/timer_${secondsArray[1]}.png`
        timerTwoDigitNumber.src = `./assets/minesweeper-sprites/timer_${secondsArray[0]}.png`
      }
      else if (secondsArray.length === 3) {
        timerOneDigitNumber.src = `./assets/minesweeper-sprites/timer_${secondsArray[2]}.png`
        timerTwoDigitNumber.src = `./assets/minesweeper-sprites/timer_${secondsArray[1]}.png`
        timerThreeDigitNumber.src = `./assets/minesweeper-sprites/timer_${secondsArray[0]}.png`
      }
      seconds++
    }, 1000)
  }

  function stopTimer() {
    clearInterval(timer)
  }

  function setBombsCounter(bombsCount) {
    const bombsArr = [...String(bombsCount)]
    if (bombsArr.length === 1) {
      bombsOneDigitNumber.src = `./assets/minesweeper-sprites/timer_${bombsArr[0]}.png`
    }
    else if (bombsArr.length === 2) {
      bombsOneDigitNumber.src = `./assets/minesweeper-sprites/timer_${bombsArr[1]}.png`
      bombsTwoDigitNumber.src = `./assets/minesweeper-sprites/timer_${bombsArr[0]}.png`
    }
    else if (bombsArr.length === 3) {
      bombsOneDigitNumber.src = `./assets/minesweeper-sprites/timer_${bombsArr[2]}.png`
      bombsTwoDigitNumber.src = `./assets/minesweeper-sprites/timer_${bombsArr[1]}.png`
      bombsThreeDigitNumber.src = `./assets/minesweeper-sprites/timer_${bombsArr[0]}.png`
    }
  }
}