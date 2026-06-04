async function fetchUserPosts() {
    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts?userId=3"
        );

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const posts = await response.json();

        posts.forEach(post => {
            console.log(post.title.toUpperCase());
        });

        console.log(`Total posts: ${posts.length}`);
    } catch (error) {
        console.error("Failed to fetch posts:", error.message);
    }
}

fetchUserPosts();