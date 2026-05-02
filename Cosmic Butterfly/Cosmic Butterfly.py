import turtle
import colorsys

def draw_butterfly_fractal():
    screen = turtle.Screen()
    screen.bgcolor("black")
    screen.title("Cosmic Butterfly")

    t = turtle.Turtle()
    t.speed(0)
    t.hideturtle()
    turtle.tracer(2, 0)

    for i in range(400):
        color = colorsys.hsv_to_rgb(i / 400, 0.9, 1.0)
        t.pencolor(color)

        t.circle(i, 90)
        t.left(91)
        t.circle(i, 90)
        t.left(181)
        t.forward(i / 15)

    turtle.done()

# Run function
draw_butterfly_fractal()