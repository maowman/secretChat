<script lang="ts">
    export let title:string ,subtitle:string,type:string = "is-primary";
</script>

<section class="hero {type}" >
    <div class="hero-body">
      <div class="container">
        <h1 class="title">
          {title}
        </h1>
        <h2 class="subtitle">
          {subtitle}
        </h2>
      </div>
    </div>
  </section>