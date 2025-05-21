<template>
    <header>
        <div class="logo">Algo-Votes</div>
        <div class="navbar">
            <ul>
                <li>
                    <router-link
                        to="/"
                        class="nav-item"
                        active-class="link-active"
                        exact
                    >
                        Home
                    </router-link>
                </li>
                <li>
                    <router-link
                        to="/mymatches"
                        class="nav-item"
                        active-class="link-active"
                        exact
                    >
                        My Vote
                    </router-link>
                </li>
            </ul>
        </div>
    </header> 
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: "NavBar",
    props: {
        text: String
    }
})
</script>

<style scoped>

header {
    background-color: #f8f9fa;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 80px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e0e0e0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}

header * {
    display: inline;
}

header li {
    margin: 20px;
    font-size: 18px;
}

header li a {
    color: #343a40;
    text-decoration: none;
    transition: color 0.3s ease;
}

header li a:hover {
    color: #007bff;
}

.logo {
    font-size: 45px;
    font-weight: bold;
    margin-left: 20px;
    color: #007bff;
}

.link-active {
    color: #007bff;
    font-weight: bold;
}

.navbar {
    margin: 0 auto;
    padding: 0;
}

.nav-item {
    padding: 0px 20px;
    font-size: 20px;
    color: #2c3e50;
    text-decoration: none;
    transition: color 0.3s ease;
}

.nav-item:hover {
    color: #007bff;
}

</style>
