import React from 'react';

const Q4VectorFormCoulomb = () => {
  return (
    <div className="long-question">
      <h3>Q.4 What is the vector form of Coulomb's law?</h3>
      
      <div className="answer">
        <h4>VECTOR FORM OF COULOMB'S FORCE</h4>
        
        <p>
          Consider two like charges \( q_1 \) and \( q_2 \) having a distance \( r \) between them. If we denote the force exerted on \( q_2 \) by \( q_1 \) as \( \vec{F}_{21} \) and that on charge \( q_1 \) due to \( q_2 \) as \( \vec{F}_{12} \).
        </p>

        <p>
          If \( \vec{r}_{21} \) is a unit vector directed from \( q_1 \) to \( q_2 \) and \( \vec{r}_{12} \) is the unit vector directed from \( q_2 \) to \( q_1 \) then:
        </p>
        
        <div className="formula">
          \[\vec{F}_{21} = \frac{1}{4\pi\epsilon_0} \frac{q_1 q_2}{r^2} \vec{r}_{21} \quad \ldots \quad (i)\]
          \[\vec{F}_{12} = \frac{1}{4\pi\epsilon_0} \frac{q_1 q_2}{r^2} \vec{r}_{12}\]
        </div>
        
        <p>From figure:</p>
        
        <div className="formula">
          \[\vec{r}_{21} = -\vec{r}_{12}\]
        </div>
        
        <p>Putting this in equation (i):</p>
        
        <div className="formula">
          \[\therefore \vec{F}_{21} = \frac{1}{4\pi\epsilon_0} \frac{q_1 q_2}{r_2} \left( -\vec{r}_{12} \right)\]
          \[\vec{F}_{21} = -\left( \frac{1}{4\pi\epsilon_0} \frac{q_1 q_2}{r_2} \vec{r}_{12} \right)\]
          \[\therefore \vec{F}_{21} = -\vec{F}_{12}\]
        </div>
        
        <div className="conclusion">
          <p>
            Hence Coulomb's force is mutual force, it means that if \( q_1 \) exerts a force on \( q_2 \) then \( q_2 \) also exerts an equal and opposite force on \( q_1 \). Coulomb's force is also known as electrostatic force and force of interaction.
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
        .conclusion {
          background: #fff8e1;
          padding: 15px;
          border-left: 4px solid #ffa000;
          margin: 20px 0;
          border-radius: 5px;
        }
        .conclusion p {
          margin: 0;
          color: #5d4037;
        }
      `}</style>
    </div>
  );
};

export default Q4VectorFormCoulomb;