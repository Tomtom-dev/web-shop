const fs= require('fs')

class UsersRepository {
    constructor(filename){
        if(!filename){
            throw new Error(' Creating a repository requires a filename')
        }

        this.filename = filename;
        try{
            fs.accessSync(this.filename)
        }catch(err){
            fs.writeFileSync(this.filename, '[]')
        }
    }
    async getAll(){
        // Open the file called this.filename
        return JSON.parse(await fs.promises.readFile(this.filename, {
            encoding :'utf8'
        }));
    }

    async create(attribute){
        const records = await this.getAll();
        records.push(attribute);
        // write the updates 'records' array back to this.filename
        await this.writeAll(records)
    }

    async writeAll (records){
        await fs.promises.writeFile(this.filename, JSON.stringify(records,null, 2))
    }
}

const test = async () =>{
    const repo = new UsersRepository('users.json');
    
    await repo.create({email: "tes@this.com", password: '1234', })
    const users = await repo.getAll()
    console.log(users);
}

test()