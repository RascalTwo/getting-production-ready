export default function Counter({ count, changeCounter }) {
  return (
    <section>
      <button onClick={() => changeCounter(-1)}>-</button>
      <div>{count}</div>
      <button onClick={() => changeCounter(1)}>+</button>
    </section>
  )
}