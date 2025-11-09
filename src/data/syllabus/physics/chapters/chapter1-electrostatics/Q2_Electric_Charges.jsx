import React from 'react';

const Q2ElectricCharges = () => {
  return (
    <div className="long-question">
      <h3>Q.2 Describe electric charges.</h3>
      
      <div className="answer">
        <h4>ELECTRIC CHARGE</h4>
        <p>
          It is the property of a material due to which it attracts or repels other bodies. In 1600 A.D. Gilbert showed that some of the substance when rubbed with other acquired the property of attraction.
        </p>
        <p>
          A similar property is observed when a glass rod is rubbed with silk or ebonite rod is rubbed with animal fur, they acquired the property of attracting the small bodies Franklin gave the name of positive charge on a glass rod rubbed with silk and negative charge on the ebonite rod rubbed with animal fur.
        </p>
        <p>
          According to modern concept, each substance consists of atoms, the atom has a central part called the nucleus around which the electrons revolve. The nucleus is made up of protons and neutrons. The proton has a positive charge and the electron has a negative charge. So the atom on the whole is neutral. The total positive charge on the nucleus is equal to the total negative charge on the electrons. Thus when one metal rubbed with another, sharing of electrons take place. That is one loses electrons and other gains electrons. When a glass rod rubbed with silk, the rod loses electrons and silk gains electrons.
        </p>
        <p>
          As both were initially neutral. So the glass rod loses electrons gets positive charge and the silk gains electron, gets negative charge.
        </p>
        
        <div className="important-point">
          <strong>Unit of Electric Charge:</strong> SI unit of charge is coulomb.
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
          margin-bottom: 10px;
        }
        p {
          line-height: 1.6;
          color: #333;
          margin-bottom: 10px;
        }
        .important-point {
          background: #e8f5e8;
          padding: 10px;
          border-left: 4px solid #4caf50;
          margin: 15px 0;
        }
      `}</style>
    </div>
  );
};

export default Q2ElectricCharges;