module.exports = ({
    id,
    name,
    avatar,
    country,
    city,
    mini_bio,
    bio,
    main_language,
    languages,
    abilities,
    orders,
    portfolio
}) => {
    const totalStars = (raiting) => raiting.reduce( (accumulator, rate) => accumulator + (rate.stars ?? 0) , 0 )
    const groupedStars = (raiting) => raiting.reduce( (accumulator, rate) => {
        const total = rate.stars

        if(accumulator[total] === undefined ) {
            accumulator[total] = 1
            
            return accumulator
        }

        accumulator[total] = accumulator[total] + 1

        return accumulator
    }, {})

    const orderWithStars = orders
                .map( ({ raiting }) => {
                    const count = raiting.length
                    const total = totalStars(raiting)
                    const grouped = groupedStars(raiting)
                    const mean = total / (count !== 0 ? count : 1 )
                    
                    return {
                        count,
                        total,
                        mean,
                        stars: grouped
                    }
                })
                .filter( ({ count }) => count !== 0 )


    const total = orderWithStars

    const mean = orderWithStars.reduce( (accumulator, order) => {
        return accumulator + order.mean
    }, 0) / orderWithStars.length

    const stars = orderWithStars.reduce( (accumulator, order) => {
        Object.entries(order.stars).forEach( ([key, value]) => {
            if(accumulator[key] === undefined){
                accumulator[key] = value
            } else {
                accumulator[key] = accumulator[key] + value
            }
        })

        return accumulator
    }, {})

    // const formatted = Object.entries(stars).map( ([key, total]) => ({ value: parseInt(key), count: total }))

    // const raiting = {
    //     count: user.avaliations.length,
    //     stars: formatted,
    //     testimonials: user.avaliations
    // }

    // user.avaliations = raiting

    return {
        id,
        name,
        avatar,
        country,
        city,
        mini_bio,
        bio,
        main_language,
        languages,
        abilities,
        portfolio
    }

}