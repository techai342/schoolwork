import React from 'react';

const Q1ElectrostaticsDefinition = () => {
  return (
    <div className="long-question">
      <h3>Q.1 Define electrostatics.</h3>
      
      <div className="answer">
        <h4>ELECTROSTATICS</h4>
        <p>
          It is the branch of physics which deals with charges at rest, under the action of electric forces.
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
          margin-bottom: 10px;
        }
        p {
          line-height: 1.6;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default Q1ElectrostaticsDefinition;