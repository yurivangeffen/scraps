
export class Name {

    public static randomName(): string {
        const starters = [
            'B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z',
            'Br', 'Cr', 'Dr', 'Fr', 'Gr', 'Kr', 'Pr'
        ];

        const betweens = [
            'a', 'e', 'i', 'o', 'u',
            'au', 'ou', 'ee', 'oo', 'ae'
        ];

        const consonants = "bcdfghjklmnpqrstvwxz"; //no y

        const stops = [
            'b', 'p', 't', 'd', 'r', 'l', 'n'
        ];


        var name = starters[Math.floor(Math.random() * starters.length)];

        var times = Math.ceil(Math.random() * 2);
        for (var i = 0; i < times; i++) {
            name += betweens[Math.floor(Math.random() * betweens.length)];
            name += consonants[Math.floor(Math.random() * consonants.length)];
        }

        name += betweens[Math.floor(Math.random() * betweens.length)];
        name += stops[Math.floor(Math.random() * stops.length)];

        if (Math.round(Math.random()) == 1)
            name += betweens[Math.floor(Math.random() * betweens.length)] + "licious";
        else
            name += "icious";

        return name;
    }
}
