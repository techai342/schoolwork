import React from 'react';

const Q6FieldsOfForce = () => {
  return (
    <div className="long-question">
      <h3>Q.6 Describe the fields of force.</h3>
      
      <div className="answer">
        <h4>FIELDS OF FORCE</h4>
        
        <p>
          Newton's universal gravitational law and Coulomb's law enable us to calculate the magnitude as well as the directions of the gravitational and electric forces, respectively. However one may question:
        </p>

        <div className="questions">
          <p>(a) What are the origins of these forces?</p>
          <p>(b) How are these force transmitted from one mass to another or from one charge to another?</p>
        </div>

        <p>
          The answer to (a) is still unknown; the existence of these forces is accepted as it is. That is why they are called basic forces of nature.
        </p>

        <div className="faraday-concept">
          <h5>Faraday Concept:</h5>
          <p>
            To describe the mechanism by which electric force is transmitted, Michael Faraday (1791-1867) introduced the concept of an electric field. According to his theory, it is the intrinsic property of nature that an electric field exists in the space around an electric charge. This electric field is considered to be a force field that exerts a force on other charges placed in that field.
          </p>
          <p>
            For example, a charge q produces an electric field in the space surrounding it. This field exists whether the other charges are present in space or not. However, the presence of field cannot be tested until another charge \(q_0\) is brought into the field. Thus the field of charge q interacts with \(q_0\) to produce an electrical force.
          </p>
          <p>
            The interaction between q and \(q_0\) is accomplished in two steps: 
          </p>
          <div className="steps">
            <p>(a) the charge q produces a field and</p>
            <p>(b) the field interacts with charge \(q_0\) to produce a force \(F\) on \(q_0\).</p>
          </div>
          <p>These two steps are illustrated in figure as shown.</p>
        </div>

        <div className="observation">
          <p>
            In this figure the density of dots is proportional to the strength of the field at the various points.
          </p>
        </div>

        <div className="figure-caption">
          <p>Fig. (a) Dots surrounding the positive charge indicate the presence of the electric field. The density of the dots is proportional to the strength of the electric field at different points.</p>
          <p>Fig. (b) Interaction of the field with the charge \(q_0\).</p>
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
        .questions {
          background: #fff3e0;
          padding: 15px;
          border-left: 4px solid #ff9800;
          margin: 15px 0;
          border-radius: 5px;
        }
        .faraday-concept {
          background: #f3e5f5;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .steps {
          background: #e8eaf6;
          padding: 15px;
          margin: 15px 0;
          border-radius: 5px;
        }
        .observation {
          background: #e8f5e8;
          padding: 12px;
          border-left: 4px solid #4caf50;
          margin: 15px 0;
          border-radius: 5px;
        }
        .figure-caption {
          background: #f5f5f5;
          padding: 12px;
          border: 1px dashed #999;
          margin: 15px 0;
          border-radius: 5px;
          font-style: italic;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default Q6FieldsOfForce;