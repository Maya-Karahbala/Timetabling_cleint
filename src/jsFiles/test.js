 const   fetchData = (data) => {
         fetch("http://localhost:3004/courses/1")
        .then(response => response.json())
        .then(d => {
           console.log( "data" ,d)
        })
        .catch(error => {
        
        })
    }
fetchData()