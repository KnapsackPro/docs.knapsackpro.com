---
pagination_next: null
pagination_prev: null
---

# Test files and branch names encryption

Knapsack Pro collects a minimal amount of data about your project:

- File paths of your tests (e.g., `spec/models/user_spec.rb`)
- Branch name
- Commit hash
- Number of parallel CI nodes
- CI node index
- Tests execution time

If you consider test file names or branch names sensitive data, you can encrypt them with `Digest::SHA2.hexdigest` and a 64-char salt before they are sent to the Knapsack Pro API. Thanks to the salt, only you will be able to decrypt test file names or branch names.

## Enable encryption

- [Generate](https://knapsackpro.com/dashboard) a new API token (do not use the same token for encrypted and non-encrypted runs)
- Create a salt with `bundle exec rake knapsack_pro:salt`
- Pass the salt to Knapsack Pro with [`KNAPSACK_PRO_SALT`](/ruby/reference/#knapsack_pro_salt)
- Enable test file names encryption with [`KNAPSACK_PRO_TEST_FILES_ENCRYPTED=true`](/ruby/reference/#knapsack_pro_test_files_encrypted)
- Enable branch name encryption with [`KNAPSACK_PRO_BRANCH_ENCRYPTED=true`](/ruby/reference/#knapsack_pro_branch_encrypted)

## Caveats

When you enable encryption, your first test suite split will not be optimal because Knapsack Pro needs to map encrypted test file names to test timings again.

Also, note that the following branch names won't be encrypted to allow the Knapsack Pro API to determine timings for test files on newly created branches:
- `master`
- `main`
- `develop`
- `development`
- `dev`
- `staging`
- `production`
- [full list](https://github.com/KnapsackPro/knapsack_pro-ruby/blob/master/lib/knapsack_pro/crypto/branch_encryptor.rb) of non-encryptable branches

## Debug test file names

You can check what's the hash of a particular test file name with:

```bash
KNAPSACK_PRO_SALT=MY_SALT bundle exec rake "knapsack_pro:encrypted_test_file_names[rspec]"
```

Pass your test runner to the rake task (e.g., `rspec`, `minitest`, `test_unit`, `cucumber`, `spinach`).

## Debug branch names

You can check what's the hash of a particular branch name with:

```bash
# All local branches
KNAPSACK_PRO_SALT=MY_SALT bundle exec rake knapsack_pro:encrypted_branch_names

# Specific branch
KNAPSACK_PRO_SALT=MY_SALT bundle exec rake "knapsack_pro:encrypted_branch_names[MY_UNENCRYPTED_BRANCH_NAME]"
```
