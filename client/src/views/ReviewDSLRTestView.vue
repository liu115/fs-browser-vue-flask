<template>
  <div class="spinner-border" role="status" v-if="is_loading">
    <span class="visually-hidden">Loading...</span>
  </div>
  <!-- <input @keypress.left="prev" @keypress.right="next"/> -->
    <div class="container">
      <h1> Path: {{ this.$route.query.path }} </h1>
      <h2> #files: {{ file_data.length }} </h2>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li v-for="(fn, idx) in this.$route.query.path.split('/')" class="breadcrumb-item">
            <a href="#" @click="() => goRootPath(idx)">{{ fn }}</a>
          </li>
        </ol>
      </nav>
      <div class="d-grid gap-2 d-md-block">
        <button type="button" class="m-2 btn btn-secondary" @click="() => changeSortBy('name')">Sort by name</button>
        <button type="button" class="m-2 btn btn-secondary" @click="() => changeSortBy('mtime')">Sort by date</button>
        <button type="button" class="m-2 btn btn-secondary" @click="() => changeSortBy('size')">Sort by size</button>
      </div>

      <div class="row">
        <div class="col" >
          <ul class="list-group" :style="{ height: '500px', overflow: 'scroll'}" id="fileNameList">
            <li v-for="(file, idx) in file_data" class="list-group-item" :class="{active: idx == cur_idx}" @click="() => chose_idx(idx)">
              {{ file.name }}
              <button v-if="file.isDir === true" class="float-end btn btn-outline-dark" type="button" @click="() => goName(file.name)"> go</button>
              <p v-if="file.isDir === false" class="float-end m-1"> {{ getSizeString(file.size) }} </p>
              <p v-if="file.isDir === false" class="float-end m-1"> {{ getTimeString(file.mtime) }} </p>
            </li>
          </ul>
        </div>
        <div class="col" >
          <button v-if="curIsFile()" class="float-end btn btn-dark m-1" type="button" @click="download"> Download </button>
          <img v-show="!loading_img" v-if="curIsImage()" :src="getSubFilePath()" class="img-fluid" alt="Responsive image" @load="() => {loading_img = false}">
          <div class="spinner-border" role="status" v-if="curIsImage() && loading_img">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
import axios from "axios";
export default {
  props: {
  },
  data() {
    return {
      is_loading: false,
      file_data: [],
      sort_by: "name",
      cur_idx: 0,
      loading_img: false,
    }
  },
  watch: {
    '$route' (to, from) {
      // react to route changes...
      this.updatePath();
    }
  },
  methods: {
    updatePath() {
      console.log(this.$route.query.path);
      const path = `/get?path=${this.$route.query.path}`;
      this.is_loading = true;
      axios.get(path)
        .then((res) => {
          console.log(res.data);
          this.file_data = res.data;
          document.title = this.$route.query.path.split('/').slice(-1);
          this.sortData();
        })
        .catch((err) => {
        })
        .finally(() => {
          this.is_loading = false;
        })
    },
    goRootPath(idx) {
      const path = this.$route.query.path.split('/').slice(0, idx + 1);
      console.log("GOTO: ", path);
      this.$router.push({ path: '/', query: { path: path.join('/') } });
    },
    goName(name) {
      const path = this.$route.query.path.split('/');
      path.push(name);
      console.log("GOTO: ", path);
      this.$router.push({ path: '/', query: { path: path.join('/') } });
    },
    curIsImage() {
      if (this.file_data.length == 0) {
        return false;
      }
      if (!this.file_data[this.cur_idx]) return false;
      const fn = this.file_data[this.cur_idx].name.toLowerCase();
      if (fn.endsWith(".jpg") || fn.endsWith(".png")) {
        return true;
      }
      return false;
    },
    curIsFile() {
      if (this.file_data.length == 0) {
        return false;
      }
      if (!this.file_data[this.cur_idx]) return false;
      return this.file_data[this.cur_idx].isDir === false
    },
    getSubFilePath() {
      // this.load_img = true;
      return `/get?path=${this.$route.query.path}/${this.file_data[this.cur_idx].name}`
    },
    download() {
      window.open(this.getSubFilePath(), '_blank')
    },
    getSizeString(size) {
      if (size < 1000) {
        return `${size.toFixed(2)} KB`
      }
      if (size < 1000 * 1000) {
        return `${(size / 1000).toFixed(2)} MB`
      }
      // if (size < 1000 * 1000 * 1000) {
      // }
      return `${(size / 1000 / 1000).toFixed(2)} GB`
    },
    getTimeString(timestamp) {
      const date = new Date(timestamp * 1000);
      return date.toLocaleString();
    },
    sortData() {
      this.file_data.sort((a, b) => {
        if (a.isDir === true && b.isDir === false) {
            return -1;
        }
        if (a.isDir === false && b.isDir === true) {
          return 1;
        }
        if (this.sort_by == "name") {
          return a.name.localeCompare(b.name);
        }
        if (this.sort_by == "size") {
          return a.size - b.size;
        }
        if (this.sort_by == "mtime") {
          // return a.mtime - b.mtime;
          return a.mtime - b.mtime;
        }
        // if (this.sort_by == "type") {

        // }
      })
    },
    changeSortBy(ref) {
      this.sort_by = ref;
      this.sortData();
      this.chose_idx(0);
    },
    chose_idx(idx) {
      this.cur_idx = idx;
      this.loading_img = true;
    },
    keypress(e) {
      console.log(e.key)
      if (e.key == "ArrowLeft" || e.key == "ArrowUp") {
        if (this.cur_idx > 0) {
          this.chose_idx(this.cur_idx - 1);
        }
      }
      if (e.key == "ArrowRight" || e.key == "ArrowDown") {
        if (this.cur_idx < this.file_data.length - 1) {
          this.chose_idx(this.cur_idx + 1);
        }
      }
      // document.querySelector("#fileNameList").children[this.cur_idx].scrollIntoView({ behave: "smooth", block: "center" });
      document.querySelector("#fileNameList").children[this.cur_idx].scrollIntoView({ block: "center" });
    },
  },
  mounted() {
    this.updatePath();
    window.addEventListener('keydown', this.keypress);
  },
  unmounted() {
    window.removeEventListener('keydown', this.keypress);
  }

}
</script>