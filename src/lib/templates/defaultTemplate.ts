export const defaultResumeTemplate = `
  <div class="resume-template bg-white p-10 shadow-xl max-w-5xl mx-auto border border-gray-100 rounded-lg">
    <!-- Header Section -->
    <header class="bg-gradient-to-r from-slate-900 to-slate-700 text-white p-6 rounded-lg mb-8 -mx-2">
      <h1 class="text-5xl font-light mb-4 tracking-wide">
        {{info.name}}
      </h1>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm opacity-90">
        <div class="flex items-center">
          <span class="font-medium mr-2">Email:</span>
          <span>{{info.email}}</span>
        </div>
        <div class="flex items-center">
          <span class="font-medium mr-2">Phone:</span>
          <span>{{info.phone}}</span>
        </div>
        <div class="flex items-center">
          <span class="font-medium mr-2">Address:</span>
          <span>{{info.address}}</span>
        </div>
        <div class="flex items-center">
          <span class="font-medium mr-2">Website:</span>
          <a href="{{info.website}}" class="text-blue-200 hover:text-blue-100 underline">
            {{info.website}}
          </a>
        </div>
      </div>
    </header>

    <!-- Summary Section -->
    {{#if info.summary}}
    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-slate-800 mb-4 pb-2 border-b-2 border-slate-200">
        Professional Summary
      </h2>
      <div class="bg-slate-50 p-4 rounded-lg">
        <p class="text-slate-700 leading-relaxed text-base">{{info.summary}}</p>
      </div>
    </section>
    {{/if}}

    <!-- Experience Section -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-slate-800 mb-4 pb-2 border-b-2 border-slate-200">
        Professional Experience
      </h2>
      {{#each experience}}
      <div class="mb-6 bg-gray-50 p-5 rounded-lg border-l-4 border-blue-500">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-xl font-semibold text-slate-800">
            {{this.title}}
          </h3>
          <span class="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border">
            {{this.startDate}} - {{this.endDate}}
          </span>
        </div>
        <p class="text-blue-600 font-medium mb-3">{{this.companyName}}</p>
      </div>
      {{/each}}
    </section>

    <!-- Education Section -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-slate-800 mb-4 pb-2 border-b-2 border-slate-200">
        Education
      </h2>
      {{#each education}}
      <div class="mb-4 bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-500">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-semibold text-slate-800 text-lg">{{this.degree}}</h3>
            <p class="text-emerald-600 font-medium">{{this.institution}}</p>
          </div>
          <span class="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border">
            {{this.startDate}} - {{this.endDate}}
          </span>
        </div>
      </div>
      {{/each}}
    </section>

    <!-- Skills Section -->
    <section class="mb-6">
      <h2 class="text-2xl font-semibold text-slate-800 mb-4 pb-2 border-b-2 border-slate-200">
        Technical Skills
      </h2>
      <div class="bg-indigo-50 p-4 rounded-lg">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          {{#each skills}}
          <div class="flex items-center bg-white px-3 py-2 rounded-md shadow-sm border border-indigo-100">
            <div class="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
            <span class="text-slate-700 font-medium">{{this}}</span>
          </div>
          {{/each}}
        </div>
      </div>
    </section>
  </div>
`;
