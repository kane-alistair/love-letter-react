import React from 'react';

const PlayerCreator = ({}) => }

const handleSubmit = () => {
    console.log(triggering);
}

return(
  <div>
    <h1>
      <label for="name">Enter your name</label>
      <form action="POST">
        <input type="text" id="name" name="name"/>
      </form>
      <input type="submit" onSubmit={handleSubmit}/>
    </h1>
  </div>
)
};

export default PlayerCreator;
