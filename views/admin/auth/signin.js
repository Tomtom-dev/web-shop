module.exports = ({req}) =>{
    return `
        <div>
            Your Id is : ${req.session.userId}
            <form method="POST">
                <input name="email" placeholder="email" />
                <input name="password" placeholder="password" />
                <button> Sign In </button>
            </form>
        </div>
    `;
}