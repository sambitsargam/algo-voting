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
    background-color: white;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 80px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #AAAAAA;
}

header * {
    display: inline;
}

header li {
    margin: 20px;
    font-size: 18px;
}

header li a {
    color: black;
    text-decoration: none;
}

.logo {
    font-size: 45px;
    font-weight: bold;
    margin-left: 20px;
}

.link-active {
    color: royalblue;
}
/*


.navbar {
    margin: 0 auto;
    padding: 0;
}

.nav-item {
    padding: 0px 20px;
    font-size: 20px;
    color: #2c3e50;
    text-decoration: none;
}

.nav-item:hover {
    color: #2c3e50;
}


.link-active {
  background-color: #04AA6D;
  color: #f2f2f2;
}

.link-active:hover {
  background-color: #04AA6D;
}
*/

</style>