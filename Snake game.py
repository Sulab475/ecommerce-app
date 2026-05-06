import pygame
import random

pygame.init()

# Screen
width, height = 600, 400
screen = pygame.display.set_mode((width, height))
pygame.display.set_caption("Snake Game")

# Colors
white = (255,255,255)
green = (0,255,0)
red = (255,0,0)
black = (0,0,0)

# Snake
snake_block = 10
snake_speed = 15

clock = pygame.time.Clock()

def draw_snake(snake_block, snake_list):
    for x in snake_list:
        pygame.draw.rect(screen, green, [x[0], x[1], snake_block, snake_block])

def game():
    game_over = False
    x, y = width/2, height/2
    dx, dy = 0, 0

    snake_list = []
    length = 1

    food_x = random.randrange(0, width, 10)
    food_y = random.randrange(0, height, 10)

    while not game_over:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                game_over = True

            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_LEFT:
                    dx, dy = -10, 0
                elif event.key == pygame.K_RIGHT:
                    dx, dy = 10, 0
                elif event.key == pygame.K_UP:
                    dx, dy = 0, -10
                elif event.key == pygame.K_DOWN:
                    dx, dy = 0, 10

        x += dx
        y += dy

        screen.fill(black)
        pygame.draw.rect(screen, red, [food_x, food_y, snake_block, snake_block])

        snake_head = [x, y]
        snake_list.append(snake_head)
        if len(snake_list) > length:
            del snake_list[0]

        for block in snake_list[:-1]:
            if block == snake_head:
                game_over = True

        draw_snake(snake_block, snake_list)

        pygame.display.update()

        if x == food_x and y == food_y:
            food_x = random.randrange(0, width, 10)
            food_y = random.randrange(0, height, 10)
            length += 1

        clock.tick(snake_speed)

    pygame.quit()

game()