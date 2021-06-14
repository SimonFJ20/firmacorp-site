
(async () => {
    
    const response = await (await fetch('/api/carousel/get')).json()
    
    for(let i in response.products) {
        
    }
    
    
})()


