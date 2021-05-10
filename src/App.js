import React, { useState, useEffect, useRef } from 'react'
import './App.css'

const App = () => {
  const canvasRef = useRef()

  // Global Variables
  let drag = false
  let startX
  let startY
  let canvas
  let ctx
  let offsetX
  let offsetY
  let WIDTH
  let HEIGHT

  const [alignText, setAlignText] = useState('')
  const [shapes, setShapes] = useState([
    {
      x: 50,
      y: 50,
      width: 200,
      height: 200,
      fill: '#095ede',
      isDragging: false,
    },
    {
      x: 300,
      y: 100,
      width: 100,
      height: 200,
      fill: '#ed6d64',
      isDragging: false,
    },

    {
      x: 100,
      y: 500,
      width: 200,
      height: 75,
      fill: '#69ffed',
      isDragging: false,
    },
  ])

  const getCoordinates = (s) => {
    var newCoords = {
      left: [],
      center: [],
      right: [],
      top: [],
      middle: [],
      bottom: [],
    }

    shapes.forEach((shape) => {
      if (shape !== s) {
        // Horizontal Coordinates
        const left = shape.x
        const center = shape.x + shape.width / 2
        const right = shape.x + shape.width
        // Vertical Coordinates
        const top = shape.y
        const middle = shape.y + shape.height / 2
        const bottom = shape.y + shape.height

        newCoords.left.push(left)
        newCoords.center.push(center)
        newCoords.right.push(right)
        newCoords.top.push(top)
        newCoords.middle.push(middle)
        newCoords.bottom.push(bottom)
      }
    })

    return newCoords
  }

  useEffect(() => {
    canvas = canvasRef.current
    ctx = canvas.getContext('2d')
    WIDTH = canvas.width
    HEIGHT = canvas.height
    offsetX = canvas.getBoundingClientRect().left
    offsetY = canvas.getBoundingClientRect().top
    getCoordinates()
  }, [canvasRef])

  const rect = (x, y, w, h) => {
    ctx.beginPath()
    ctx.rect(x, y, w, h)
    ctx.closePath()
    ctx.fill()
  }

  const clear = () => {
    ctx.clearRect(0, 0, WIDTH, HEIGHT)
  }

  const draw = () => {
    clear()
    ctx.fillStyle = '#f0f0f0'
    rect(0, 0, WIDTH, HEIGHT)

    var newShapes = shapes

    newShapes.forEach((shape) => {
      ctx.fillStyle = shape.fill
      rect(shape.x, shape.y, shape.width, shape.height)
    })
  }

  // To Do: Draw Pink Alignemnt line
  // const drawHLine = (x, y) => {
  //   ctx.fillStyle = '#f50ae1'
  //   ctx.beginPath()
  //   ctx.rect(x, y, 50, 50)
  //   ctx.closePath()
  //   ctx.fill()
  // }

  // const drawVLine = (x, y) => {
  //   ctx.fillStyle = 'red'
  //   ctx.beginPath()
  //   ctx.rect(10, 10, 50, 50)
  //   ctx.closePath()
  //   ctx.fill()
  // }

  // const clearLine = () => {}

  const click = (e) => {
    e.preventDefault()
    e.stopPropagation()
    var mouseX = parseInt(e.clientX - offsetX)
    var mouseY = parseInt(e.clientY - offsetY)

    drag = false
    var newShapes = shapes

    newShapes.forEach((shape) => {
      if (
        mouseX >= shape.x &&
        mouseX <= shape.x + shape.width &&
        mouseY >= shape.y &&
        mouseY <= shape.y + shape.height
      ) {
        drag = true
        shape.isDragging = true
      }
    })

    setShapes(newShapes)
    startX = mouseX
    startY = mouseY
  }

  const move = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (drag) {
      var mouseX = parseInt(e.clientX - offsetX)
      var mouseY = parseInt(e.clientY - offsetY)

      // Distance moved since the previous mousemove
      var moveX = mouseX - startX
      var moveY = mouseY - startY

      var newShapes = shapes

      let moveLeft
      let moveCenter
      let moveRight

      // Vertical Coordinates
      let moveTop
      let moveMiddle
      let moveBottom

      let cordinatesForOtherShapes

      newShapes.forEach((shape) => {
        if (shape.isDragging) {
          cordinatesForOtherShapes = getCoordinates(shape)
          shape.x += moveX
          shape.y += moveY

          // Horizontal Coordinates
          moveLeft = shape.x
          moveCenter = shape.x + shape.width / 2
          moveRight = shape.x + shape.width

          // Vertical Coordinates
          moveTop = shape.y
          moveMiddle = shape.y + shape.height / 2
          moveBottom = shape.y + shape.height
        }
      })

      const {
        left,
        right,
        center,
        top,
        bottom,
        middle,
      } = cordinatesForOtherShapes

      if (left && left.includes(moveLeft)) {
        setAlignText('Left Aligned')
      } else if (right && right.includes(moveRight)) {
        setAlignText('Right Aligned')
      } else if (center && center.includes(moveCenter)) {
        setAlignText('Center Aligned')
      } else if (top && top.includes(moveTop)) {
        setAlignText('Top Aligned')
      } else if (bottom && bottom.includes(moveBottom)) {
        setAlignText('Bottom Aligned')
      } else if (middle && middle.includes(moveMiddle)) {
        setAlignText('Middle Aligned')
      } else {
        setAlignText('Not Aligned to Anything')
      }

      draw()
      setShapes(newShapes)

      startX = mouseX
      startY = mouseY
    }
  }

  const drop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    drag = false
    var newShapes = shapes

    newShapes.forEach((shape) => {
      shape.isDragging = false
    })

    setShapes(newShapes)
  }

  useEffect(() => {
    canvas.onmousedown = click
    canvas.onmousemove = move
    canvas.onmouseup = drop
    draw()
  }, [shapes])

  return (
    <>
      <canvas ref={canvasRef} width={800} height={600} />
      <div>{alignText}</div>
    </>
  )
}

export default App
