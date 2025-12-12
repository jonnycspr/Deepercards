import { createRepository, getAuthenticatedUser } from '../server/github';

async function main() {
  try {
    console.log('Getting authenticated user...');
    const user = await getAuthenticatedUser();
    console.log(`Authenticated as: ${user.login}`);

    console.log('Creating repository...');
    const repo = await createRepository(
      'deeper-christian-dating-app',
      'A mobile-first progressive web application for Christian couples to have meaningful conversations through faith-based discussion cards.',
      false
    );

    console.log('Repository created successfully!');
    console.log(`Repository URL: ${repo.html_url}`);
    console.log(`Clone URL: ${repo.clone_url}`);
    console.log(`SSH URL: ${repo.ssh_url}`);
    
    console.log('\nNext steps:');
    console.log('1. Initialize git in your project: git init');
    console.log('2. Add the remote: git remote add origin ' + repo.clone_url);
    console.log('3. Add files: git add .');
    console.log('4. Commit: git commit -m "Initial commit"');
    console.log('5. Push: git push -u origin main');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
