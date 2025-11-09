import React from "react";

const Q5_Effect_Medium_Coulomb = () => {
  return (
    <div className="long-question">
      <h3>Q.5 Effect of Medium on Coulomb’s Force</h3>

      <div className="answer">
        <p>
          When a material medium such as air, glass, or water is introduced
          between two charges, the electrostatic force between them decreases
          depending upon the nature of the medium. This happens because the
          medium reduces the effective electric field.
        </p>

        <div className="formula">
          {"\\[F_{med} = \\frac{1}{4\\pi\\epsilon} \\frac{q_1 q_2}{r^2} \\quad \\ldots \\quad (i)\\]"}
        </div>

        <p>
          where {"\\( \\epsilon \\)"} is the permittivity of the medium.  
          In vacuum (or air), the permittivity is {"\\( \\epsilon_0 \\)"}.  
          Hence, the force in free space is given by:
        </p>

        <div className="formula">
          {"\\[F_0 = \\frac{1}{4\\pi\\epsilon_0} \\frac{q_1 q_2}{r^2} \\quad \\ldots \\quad (ii)\\]"}
        </div>

        <p>
          Dividing Eq. (i) by Eq. (ii):
        </p>

        <div className="formula">
          {"\\[\\frac{F_{med}}{F_0} = \\frac{\\epsilon_0}{\\epsilon} = \\frac{1}{K}\\]"}
        </div>

        <p>
          where {"\\( K \\)"} is called the <b>dielectric constant</b> or
          <b>relative permittivity</b> of the medium.
        </p>
      </div>

      <style jsx>{`
        .long-question {
          margin: 20px 0;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: #f9f9f9;
        }
        .formula {
          margin: 15px 0;
          padding: 10px;
          background: #fff;
          border-left: 4px solid #007acc;
          font-family: 'Cambria Math', serif;
          white-space: pre-wrap;
        }
        p {
          line-height: 1.6;
          color: #333;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
};

export default Q5_Effect_Medium_Coulomb;
