# Global variables

Useful variables that are defined globally, and can be used within functions as a parameter.

- [mouse](#mouse)
- [time](#time)

---

### mouse
* .x :: x position of mouse
* .y :: y position of mouse

Example:
- Control the oscillator frequency with the mouse position:
```
osc(() => mouse.x).out(o0)
```

### time

Example:
- Control the oscillator using a sine wave based on the current time:
```
osc(
  ({time}) => Math.sin(time)
)
.out(o0)
```
