const handleDomo = (e) => {
    e.preventDefault();
  
    $('#domoMessage').animate({ width: 'hide' }, 350);
  
    sendAjax('POST', $('#domoForm').attr('action'), $('#domoForm').serialize(), () => {
      loadDomosFromServer();
    });
  
    return false;
  };
  
  const DomoForm = (props) => {
      return (
          <form id="domoForm"
          onSubmit={handleDomo}
          name="domoForm"
          action="/makeRandom"
          method="POST"
          className="domoForm"
          >
              <input type="hidden" name="_csrf" value={props.csrf} />
              <input className="makeDomoSubmit" type="submit" value="Make Random Domo" />
          </form>
      )
  }
  
  const DomoList = function(props) {
      if(props.domos.length === 0) {
          return (
              <div className="domoList">
                  <h3 className="emptyDomo">No Domos yet</h3>
              </div>
          );
      }
  
      const domoNodes = props.domos.map(function(domo) {
          return (
              <div key={domo._id} className="domo">
                  <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                  <h3 className="domoName"> Name: {domo.name} </h3>
                  <h3 className="domoAge"> Age: {domo.age} </h3>
                  <h3 className="domoWins"> Wins: {domo.wins} </h3>
  
              </div>
          );
      });
  
      return (
          <div className="domoList">
              {domoNodes}
          </div>
      );
  };
  
  const loadDomosFromServer = () => {
      sendAjax('GET', '/getDomos', null, (data) => {
          ReactDOM.render(
              <DomoList domos={data.domos} />, document.querySelector("#domos")
          );
      });
  };
  
  const setup = function(csrf) {
      ReactDOM.render(
          <DomoForm csrf={csrf} />, document.querySelector("#getRandomDomo")
      );
  
      ReactDOM.render(
          <DomoList domos={[]} />, document.querySelector("#domos")
      );
  
      loadDomosFromServer();
  };
  
  const getToken = () => {
      sendAjax('GET', '/getToken', null, (result) => {
          setup(result.csrfToken);
      });
  };
  
  $(document).ready(function() {
      getToken();
  });