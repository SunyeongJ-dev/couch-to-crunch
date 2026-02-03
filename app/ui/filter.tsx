export default function Filter() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Filters</h2>
      <div className="mb-4">
        <h3 className="text-l font-bold mb-1">Level</h3>
        <ul>
          <li>Beginner</li>
          <li>Intermediate</li>
          <li>Advanced</li>
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="text-l font-bold mb-1">Type</h3>
        <ul>
          <li>Cardio</li>
          <li>Strength</li>
          <li>Flexibility</li>
          <li>HIIT</li>
          <li>Yoga</li>
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="text-l font-bold mb-1">Duration</h3>
        <ul>
          <li>Short (&lt; 30 min)</li>
          <li>Medium (30-60 min)</li>
          <li>Long (&gt; 60 min)</li>
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="text-l font-bold mb-1">Equipment</h3>
        <ul>
          <li>None</li>
          <li>Dumbbells</li>
          <li>Resistance Bands</li>
          <li>Kettlebells</li>
          <li>Barbell</li>
        </ul>
      </div>
    </div>
  );
}
