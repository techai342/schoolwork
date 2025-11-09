import React from 'react';

const Q3CoulombsLaw = () => {
  return (
    <div className="long-question">
      <h3>Q.3 State and explain Coulomb's law.</h3>
      
      <div className="answer">
        <h4>COULOMB'S LAW</h4>
        
        <h5>Introduction</h5>
        <p>
          There are two kinds of charges, positive and negative charges. The qualitative investigations made in previous classes revealed that similar charges repel and opposite charges attract each other, with a force known as force of interaction. To find magnitude and direction of such electrostatic interaction between charges coulomb carried out series of experiments using an apparatus known as Torsion Balance and proposed a law as follows.
        </p>

        <h5>Statement</h5>
        <p>
          This law states that "the force of attraction or repulsion between two point charges is directly proportional to the product of magnitude of charges and inversely proportional to the square of the distance between their centers".
        </p>

        <h5>Explanation</h5>
        <p>
          Consider two point charges \( q_1 \) and \( q_2 \) having a distance \( r \) between them. If \( F \) is the force, then according to Coulomb's law:
        </p>
        
        <div className="formula">
          \[F \propto q_1q_2 \quad \ldots \quad (i)\]
          \[F \propto \frac{1}{r^2} \quad \ldots \quad (ii)\]
        </div>
        
        <p>Combining (i) and (ii)</p>
        

        <div className="formula">
  {"\\[K = \\frac{1}{4\\pi\\epsilon_0}\\]"}
  </div>

        <p>
          Which is magnitude of coulomb force between charges. Where \( K \) is the constant of proportionality and its value is \( 9 \times 10^9 \, \text{Nm}^2/\text{C}^2 \). Its value depends upon the nature of the medium between the two charges and system of units in which \( F \), \( q \) and \( r \) are measured. If the medium between the two point charges is free space then:
        </p>
        
        <div className="formula">
          \[K = \frac{1}{4\pi\epsilon_0}\]
        </div>
        
        <p>
          where \( \epsilon_0 \) is an electrical constant, known as permittivity of free space. "The permittivity of free space or air is the permission given by air for the transmission of force from one charge to other charge". In SI units, its value is \( 8.85 \times 10^{-12} \, \text{C}^2\text{N}^{-1}\text{m}^{-2} \). Coulomb's force always acts along the line joining two charges. Therefore Coulomb's force in free space is:
        </p>
        
        <div className="important-formula">
          \[F = \frac{1}{4\pi\epsilon_0} \frac{q_1q_2}{r^2}\]
        </div>
        
        <p className="figure-caption">
          Fig. (a) Repulsive forces between like charges and (b) attractive forces between unlike charges.
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
        .answer {
          margin-top: 15px;
        }
        h4 {
          color: #2c3e50;
          margin-bottom: 15px;
        }
        h5 {
          color: #34495e;
          margin: 15px 0 10px 0;
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
        }
        .important-formula {
          margin: 15px 0;
          padding: 12px;
          background: #e3f2fd;
          border: 2px solid #2196f3;
          border-radius: 5px;
          text-align: center;
          font-weight: bold;
          font-family: 'Cambria Math', serif;
        }
        .figure-caption {
          font-style: italic;
          color: #666;
          text-align: center;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};


export default Q3CoulombsLaw;
