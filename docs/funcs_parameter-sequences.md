## Parameter sequences

- [Lists as parameter sequences](#lists-as-parameter-sequences)
- [Functions on parameter sequences](#functions-on-parameter-sequences)
    - [fast](#fast)

### Lists as parameter sequences

```
osc(
   [80, 100, 200, 50], 1 )
)
.out(o0)
```

### Functions on parameter sequences

#### fast

`fast ( amount) `

* `amount` :: float (default `x`)

```
osc(
   [80, 100, 200, 50].fast(0.2), 1 )
)
.out(o0)
```
