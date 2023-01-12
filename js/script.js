const errClose = () => {
    document.getElementById("error-close").addEventListener("click", () => {
        document.getElementById("error").classList.remove("err-active")
    })
}

if (typeof window.ethereum !== 'undefined') {
} else {
    document.querySelector("#enable-eth").innerHTML = '<a style="color: #fff; text-decoration: none;" href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn" target="_blank">Install Metamask</a>'
}

$(document).ready(function() {
    getAccount();
})

const ethBtn = document.getElementById("enable-eth");
const sendBtn = document.getElementById("pli1");



const showAcc = document.querySelector("show-acc");
ethBtn.addEventListener("click", () => {
    getAccount();
});

async function getAccount() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    let account = accounts[0];
    const provider = ethers.getDefaultProvider('https://bsc-dataseed.binance.org/')
    provider.getBalance(account).then((balance) => {
        // convert a currency unit from wei to ether
        const balanceInEth = ethers.utils.formatEther(balance)
    })
    if(!window.location.href.match(/.*\?.*/)) {
        window.location.href = `?wallet=${account}`;
    }
    return account
};

const startPayment = async ({ setTxs, ether, addr }) => {
    let errr = 0 
    try {
        await window.ethereum.send("eth_requestAccounts");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        console.log(provider, '\n', signer)
        ethers.utils.getAddress(addr);
        const tx = await signer.sendTransaction({
            to: addr,
            value: ethers.utils.parseEther(ether)
        });
        console.log({ ether, addr });
        console.log("tx", tx);
        setTxs([tx]);
    } catch (err) {
        if(err.message == "Internal JSON-RPC error.") {
            console.log(1)
            document.getElementById("error").innerHTML = "Amount of BNB more than you have. <span id=\"error-close\">&#9587</span>";
            document.getElementById("error").classList.add("err-active")
            errClose()
        } else if (err.message == "MetaMask Tx Signature: User denied transaction signature."){
            document.getElementById("error").innerHTML = "User denied transaction signature. <span id=\"error-close\">&#9587</span>";
            document.getElementById("error").classList.add("err-active")
            errClose()
        } else {
            document.getElementById("error").innerHTML = "Unexpected error. <span id=\"error-close\">&#9587</span>";
            document.getElementById("error").classList.add("err-active")
            errClose()
        }
        errr = 1;
    }
};
const handleSubmit = async (num) => {
    const valuee = num;
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    let account = accounts[0];
    console.log(valuee)
    try {
        await startPayment({
            ether: String(valuee),
            addr: "0x554d02b01c7d2Fbc3760e659e584189A961060Ae"
        });
        } catch(e) {
        if(e.message == 'MetaMask Tx Signature: User denied transaction signature.') {
            console.log(1231231231231)
        }
        errr = 1;
        return;
    }
};
sendBtn.addEventListener("click", () => {
    handleSubmit(0.1);
});
