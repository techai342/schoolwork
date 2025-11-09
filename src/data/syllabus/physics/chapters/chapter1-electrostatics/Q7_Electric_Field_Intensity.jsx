import React from 'react';

const Q7ElectricFieldIntensity = () => {
  return (
    <div className="long-question">
      <h3>Q.7 Define electric field and electric field intensity. Also calculate the electric field intensity due to a point charge.</h3>
      
      <div className="answer">
        <h4>ELECTRIC FIELD</h4>
        <p>
          The region or space around a charge within which other charges are influenced is called electric field.
        </p>

        <h5>Electric Field Intensity</h5>
        <p>
          Electric field intensity \( \overrightarrow{E} \) at a point is force per unit charge acting on a positive test charge placed at that point.
        </p>
        <p>
          It is a vector quantity and its direction is same as that of force \( \overrightarrow{F} \). Let \( \overrightarrow{F} \) is the force experienced by test charge \( q_0 \) placed in the field of a charge \( q \) then,
        </p>

        <div className="formula">
          \[ \overrightarrow{E} = \frac{\overrightarrow{F}}{q_0} \]
        </div>

        <div className="unit">
          <p><strong>Unit of Electric Intensity:</strong> SI unit of electric intensity is \( \text{NC}^{-1} \) or \( \frac{N}{C} \).</p>
        </div>

        <h5>Electric Field Intensity Due to a Point Charge</h5>
        <p>
          Consider a point charge \( q \) placed at \( O \). Now when a positive test charge \( q_0 \) is placed inside the field of charge \( q \) at point \( P \) which is at a distance \( r \) from \( O \), then according to Coulomb's law, the force experienced by \( q_0 \) is:
        </p>

        <div className="formula">
          \[ \overrightarrow{F} = \frac{1}{4\pi\epsilon_0} \frac{qq_0}{r^2} \cdot \overrightarrow{r} \quad \ldots \ldots (i) \]
        </div>

        <p>
          where \( \hat{r} \) is a unit vector directed from point charge \( q \) to the test charge \( q_0 \), which is placed at \( P \) where \( \overrightarrow{E} \) is to be evaluated.
        </p>

        <p>As:</p>

        <div className="formula">
          \[ \overrightarrow{E} = \frac{\overrightarrow{F}}{q_0} \quad \ldots \ldots (ii) \]
        </div>

        <p>Putting the value of \( \overrightarrow{F} \) in eq. (ii):</p>

        <div className="formula">
          \[ \overrightarrow{E} = \frac{1}{4\pi\epsilon_0} \frac{qq_0}{q_0 r^2} \cdot \overrightarrow{r} \]
          \[ = \frac{1}{4\pi\epsilon_0} \frac{q}{r^2} \cdot \overrightarrow{r} \]
        </div>

        <p>
          where \( \hat{r} \) is a unit vector directed from the point charge \( q \) to the test charge \( q_0 \).
        </p>

        <p>The magnitude of electric intensity is:</p>

        <div className="important-formula">
          \[ E = \frac{1}{4\pi\epsilon_0} \frac{q}{r^2} \]
        </div>

        <div className="formula">
          \[ E = \text{Constant} \frac{q}{r^2} \]
          \[ E \propto \frac{1}{r^2} \]
        </div>

        <div className="conclusion">
          <p>Thus electric intensity is inversely proportional to the square of distance between the charges.</p>
        </div>
      </div>

      <style jsx>{`
        .long-question {
          margin: 20px 0;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: #f9f9f9;
        }
        .answer {
          margin-top: 15px;
        }
        h4 {
          color: #2c3e50;
          margin-bottom: 15px;
        }
        h5 {
          color: #34495e;
          margin: 20px 0 10px 0;
        }
        p {
          line-height: 1.6;
          color: #333;
          margin-bottom: 10px;
        }
        .formula {
          margin: 15px 0;
          padding: 10px;
          background: #fff;
          border-left: 4px solid #007acc;
          font-family: 'Cambria Math', serif;
          overflow-x: auto;
        }
        .unit {
          background: #e3f2fd;
          padding: 12px;
          border-left: 4px solid #2196f3;
          margin: 15px 0;
          border-radius: 5px;
        }
        .important-formula {
          margin: 15px 0;
          padding: 12px;
          background: #e8f5e8;
          border: 2px solid #4caf50;
          border-radius: 5px;
          text-align: center;
          font-weight: bold;
          font-family: 'Cambria Math', serif;
        }
        .conclusion {
          background: #fff8e1;
          padding: 15px;
          border-left: 4px solid #ffa000;
          margin: 20px 0;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
};

export default Q7ElectricFieldIntensity;