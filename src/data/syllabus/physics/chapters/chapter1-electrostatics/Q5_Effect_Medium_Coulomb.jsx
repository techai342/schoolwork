import React from 'react';

const Q5EffectMediumCoulomb = () => {
  return (
    <div className="long-question">
      <h3>Q.5 What is the effect of medium on the Coulomb's force?</h3>
      
      <div className="answer">
        <h4>EFFECT OF MEDIUM BETWEEN THE TWO CHARGES UPON THE COULOMB'S FORCE</h4>
        
        <p>
          If the medium is an insulator, it is usually referred as dielectric. It has been found that the presence of a dielectric always reduces the electrostatic force as compared with that in free space by a certain factor which is a constant for the given dielectric. This constant is known as relative permittivity i.e., \( \epsilon_r \). Thus the Coulomb's force in a medium of relative permittivity \( \epsilon_r \) is given by:
        </p>

        <div className="formula">
          \[F_{med} = \frac{1}{4\pi\epsilon_0} \frac{q_1 q_2}{r^2} \quad \ldots \quad (i)\]
        </div>
        
        <p>when air is placed between the same two charges then,</p>
        
        <div className="formula">
          \[F_{air} = \frac{1}{4\pi\epsilon_0} \frac{q_1 q_2}{r^2} \quad \ldots \quad (ii)\]
        </div>
        
        <p>Dividing (ii) by (i):</p>
        
        <div className="formula">
          \[\frac{F_{air}}{F_{med}} = \frac{1}{4\pi\epsilon_0} \frac{q_1 q_2}{r_2} \cdot \frac{q_1 q_2}{r_2}\]
          \[\frac{F_{air}}{F_{med}} = \frac{1}{4\pi\epsilon_0} \frac{q_1 q_2}{r_2} \cdot \frac{q_1 q_2}{r_2}\]
        </div>

        <div className="table-section">
          <h5>Relative Permittivity of Various Materials</h5>
          <table>
            <thead>
              <tr>
                <th>Material</th>
                <th>\( \epsilon_r \)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Vacuum</td><td>1</td></tr>
              <tr><td>Air (1 atm)</td><td>1.0006</td></tr>
              <tr><td>Ammonia (liquid)</td><td>22–25</td></tr>
              <tr><td>Bakelite</td><td>5–18</td></tr>
              <tr><td>Benzene</td><td>2.284</td></tr>
              <tr><td>Germanium</td><td>16</td></tr>
              <tr><td>Glass</td><td>4.8–10</td></tr>
              <tr><td>Mica</td><td>3–7.5</td></tr>
              <tr><td>Paraffined paper</td><td>2</td></tr>
              <tr><td>Plexiglas</td><td>3.40</td></tr>
              <tr><td>Rubber</td><td>2.94</td></tr>
              <tr><td>Teflon</td><td>2.1</td></tr>
              <tr><td>Transformer oil</td><td>2.1</td></tr>
              <tr><td>Water (distilled)</td><td>78.5</td></tr>
            </tbody>
          </table>
        </div>

        <div className="calculation">
          <p>As for all dielectrics \( \epsilon_r > 1 \) except for air which is 1. i.e., \( \epsilon_r = 1.0006 \) this value is close to one that with negligible error.</p>
          
          <div className="important-formula">
            \[F_{med} = \frac{F_{air}}{\epsilon_r}\]
            \[\therefore F_{med} < F_{air}\]
          </div>
        </div>

        <div className="definition">
          <h5>Relative Permittivity</h5>
          <p>
            It is the ratio of force between the two charges placed in air to the force between the same two charges when a dielectric is placed between them. It has no unit.
          </p>
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
        .table-section {
          margin: 20px 0;
          overflow-x: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px 12px;
          text-align: left;
        }
        th {
          background: #f5f5f5;
          font-weight: bold;
        }
        .calculation {
          background: #f3e5f5;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
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
        .definition {
          background: #e3f2fd;
          padding: 15px;
          border-left: 4px solid #2196f3;
          margin: 20px 0;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
};

export default Q5EffectMediumCoulomb;