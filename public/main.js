const update = document.querySelector(`#update-button`)
const deleteButton = document.querySelector(`#delete-button`)
const messageDiv = document.querySelector(`#message`)

update.addEventListener('click', _ => {
    // Send the put request to update the DB.
    fetch('/quotes', {
        method: 'put',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: 'Codex',
            quote: `That's great and all, but have you got any cookies?`
        })
    })
    .then(res => {
        if (res.ok) return res.json()
    })
    .then(response => window.location.reload(true))
})

deleteButton.addEventListener('click', _ => {
    fetch('/quotes', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: 'Codex'
        })
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(response => {
            if (response === `No Codex quote to delete`) {
                messageDiv.textContent = "No Codex quote to delete"
            }
            window.location.reload()
        })
})